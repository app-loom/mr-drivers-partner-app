import React, { useEffect, useRef, useState } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, StyleSheet, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/useAuth";
import { useRide } from "../context/useRide";
import appStyle from "../lib/style";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { Colors, Fonts } = appStyle;
const groupRidesByDate = (rides = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sections = {
    Today: [],
    Earlier: [],
  };

  rides.forEach((ride) => {
    if (!ride.rideStartTime) {
      sections.Earlier.push(ride);
      return;
    }

    const rideDate = new Date(ride.rideStartTime);
    rideDate.setHours(0, 0, 0, 0);

    if (rideDate.getTime() === today.getTime()) {
      sections.Today.push(ride);
    } else {
      sections.Earlier.push(ride);
    }
  });

  return Object.entries(sections)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({
      title,
      data,
    }));
};

function RideCard({ ride }) {
  const statusMap = {
    completed: {
      bg: Colors.emerald_50,
      text: Colors.emerald_700,
      label: "Completed",
    },
    cancelled: {
      bg: Colors.alizarin_50,
      text: Colors.alizarin_600,
      label: "Cancelled",
    },
    ongoing: {
      bg: Colors.peter_river_50,
      text: Colors.peter_river_600,
      label: "Ongoing",
    },
  };

  const status = statusMap[ride.status];
  const isOngoing = ride.status === "ongoing";

  const formatIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <TouchableOpacity activeOpacity={0.92} style={[styles.card, isOngoing && styles.priorityCard]}>
      {isOngoing && <View style={styles.priorityStrip} />}

      {/* Ride ID + Status */}
      <View style={styles.headerRow}>
        <Text style={styles.rideIdTop}>Ride ID • {ride.rideId}</Text>

        <View style={[styles.statusBadge, { backgroundColor: status?.bg }]}>
          <Text style={[styles.statusText, { color: status?.text }]}>{status?.label}</Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeBlock}>
        <Text style={styles.locationLabel}>From</Text>
        <Text style={styles.locationText}>{ride.origin?.name}</Text>

        <Ionicons name="arrow-down" size={16} color={Colors.asbestos} style={{ marginVertical: 6 }} />

        <Text style={styles.locationLabel}>To</Text>
        <Text style={styles.locationText}>{ride.destination?.name}</Text>
      </View>

      {/* Time + Distance */}
      <View style={styles.bottomRow}>
        <Text style={styles.time}>
          {formatIST(ride.rideStartTime)} – {ride.rideEndTime ? formatIST(ride.rideEndTime) : "Now"}
        </Text>

        <View style={styles.distanceChip}>
          <Ionicons name="navigate" size={12} color={Colors.peter_river_600} />
          <Text style={styles.distanceText}>{ride.distancekm?.toFixed(1)} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function RidesScreen() {
  const { rideHistory, getRideHistory, setRideHistory } = useRide();
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const loadMoreHistory = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await getRideHistory(10, page);

    if (res?.history?.length > 0) {
      setRideHistory((prev) => {
        const existingIds = new Set(prev.map((r) => r._id));
        const uniqueNew = res.history.filter((r) => !existingIds.has(r._id));
        return [...prev, ...uniqueNew];
      });

      const nextPage = page + 1;
      setPage(nextPage);
      setHasMore(nextPage <= res.pagination.totalPages);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMoreHistory();
  }, []);

  const sections = React.useMemo(() => {
    return groupRidesByDate(rideHistory);
  }, [rideHistory]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Ride History</Text>
        <Text style={styles.subtitle}>Track all your previous rides</Text>
      </View>

      {rideHistory.length > 0 || loading ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RideCard ride={item} />}
          renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              loadMoreHistory();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <Text style={{ textAlign: "center" }}>Loading...</Text> : null}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No previous ride history available.</Text>
        </View>
      )}
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

  listContent: {
    paddingHorizontal: 14,
  },

  title: {
    fontSize: 26,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "700",
    color: Colors.midnight_blue_900,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
  },

  card: {
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

  priorityCard: {
    borderWidth: 1.5,
    borderColor: Colors.peter_river_300,
    backgroundColor: Colors.peter_river_50,
  },

  priorityStrip: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderRadius: 4,
    backgroundColor: Colors.peter_river_600,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#E3EEFA",
    accentColor: "#3A7BD5",
    textColor: "#243B5A",
  },

  rideIdTop: {
    fontSize: 12,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.concrete,
    fontWeight: "500",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "600",
  },

  routeBlock: {
    marginTop: 6,
    marginBottom: 12,
  },

  locationLabel: {
    fontSize: 11,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  locationText: {
    fontSize: 15,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "600",
    color: Colors.midnight_blue_900,
    lineHeight: 22,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.clouds_200,
  },

  time: {
    fontSize: 13,
    fontFamily: Fonts.GoogleSansFlex,
    color: Colors.asbestos,
  },

  distanceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.peter_river_50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: Fonts.GoogleSansFlex,
    fontWeight: "600",
    color: Colors.peter_river_600,
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
