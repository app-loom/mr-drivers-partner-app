import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, StyleSheet, SectionList } from "react-native";
import { useRide } from "../context/useRide";
import { Colors, Fonts } from "../lib/style";

const PRIMARY = "#0193e0";

const notificationIconMap = {
  accepted: {
    icon: "checkmark-circle",
    color: "#2E7D32",
    bg: "#E8F5E9",
  },

  cancelled: {
    icon: "close-circle",
    color: "#C62828",
    bg: "#FDECEA",
  },

  payment: {
    icon: "card-outline",
    color: "#1565C0",
    bg: "#E3F2FD",
  },

  completed: {
    icon: "flag-outline",
    color: "#00695C",
    bg: "#E0F2F1",
  },

  ongoing: {
    icon: "time-outline",
    color: "#EF6C00", 
    bg: "#FFF3E0",
  },
};

const groupNotificationsByDate = (notifications = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sections = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  notifications.forEach((n) => {
    if (!n.createdAt) {
      sections.Today.push(n);
      return;
    }

    const created = new Date(n.createdAt);
    created.setHours(0, 0, 0, 0);

    if (created.getTime() === today.getTime()) {
      sections.Today.push(n);
    } else if (created.getTime() === yesterday.getTime()) {
      sections.Yesterday.push(n);
    } else {
      sections.Earlier.push(n);
    }
  });

  return Object.entries(sections)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({
      title,
      data: formatNotifications(data),
    }));
};

const formatNotifications = (notifs = []) =>
  notifs.map((n) => ({
    id: n._id,
    title: n.title,
    message: n.message,
    type: n.type,
    time: new Date(n.createdAt).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }));

const defaultWelcomeNotification = {
  id: "default-welcome",
  title: "Welcome!",
  message: "Thanks for joining our community. Enjoy safe rides!",
  type: "welcome",
  time: "Today",
  icon: "notifications-outline",
};

function NotificationCard({ item }) {
  const meta = notificationIconMap[item.type] || {
    icon: "notifications-outline",
    color: Colors.asbestos,
    bg: Colors.clouds_200,
  };

  return (
    <TouchableOpacity activeOpacity={0.92} style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={22} color={meta.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { notifications, getNotifications, setNotifications } = useRide();

  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const loadMoreNotifications = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await getNotifications(10, page);

    if (res?.notifications?.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const uniqueNew = res.notifications.filter((n) => !existingIds.has(n._id));
        return [...prev, ...uniqueNew];
      });

      setPage((prev) => prev + 1);
      setHasMore(res.hasMore);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (notifications.length === 0 && page === 2) {
      loadMoreNotifications();
    }
  }, [notifications, page]);

  const sections = useMemo(() => {
    if (notifications.length === 0) {
      return [
        {
          title: "Today",
          data: [defaultWelcomeNotification],
        },
      ];
    }

    return groupNotificationsByDate(notifications);
  }, [notifications]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.screenTitle}>Notifications</Text>
        <Text style={styles.screenSubtitle}>Stay updated with your ride activity</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMoreNotifications();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  screenTitle: {
    fontSize: 26,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "700",
    color: Colors.midnight_blue_900,
  },

  screenSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    backgroundColor: Colors.whiteColor,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "600",
    color: Colors.midnight_blue_900,
    marginRight: 10,
  },

  time: {
    fontSize: 11,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.concrete,
  },

  message: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
    lineHeight: 20,
  },

  loading: {
    textAlign: "center",
    paddingVertical: 20,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 13,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "600",
    color: Colors.concrete,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
