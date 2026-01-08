import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/useAuth";

export default function AccountDetailsScreen({ navigation }) {
  const { ownUser } = useAuth();

  if (!ownUser) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No user details available.</Text>
      </SafeAreaView>
    );
  }

  const formatBoolean = (value) => (value ? "Yes" : "No");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={PRIMARY} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Account Details</Text>
            <Text style={styles.headerSubtitle}>View and manage your profile information</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("edit-profile")} activeOpacity={0.8} style={styles.editButton}>
            <Feather name="edit" size={18} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow icon="person-outline" label="Full Name" value={ownUser.fullName} />

          <DetailRow icon="call-outline" label="Mobile Number" value={ownUser.mobileNumber} />

          <DetailRow icon="checkmark-done-outline" label="Verified Mobile" value={formatBoolean(ownUser.isMobileVerified)} />

          <DetailRow icon="shield-checkmark-outline" label="Verified Account" value={formatBoolean(ownUser.isVerified)} />

          <DetailRow icon="car-outline" label="Acting Driver" value={formatBoolean(ownUser.isActingDriver)} />

          <DetailRow icon="time-outline" label="Created At" value={new Date(ownUser.createdAt).toLocaleString()} />

          <DetailRow icon="refresh-outline" label="Last Updated" value={new Date(ownUser.updatedAt).toLocaleString()} isLast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value, isLast }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const PRIMARY = "#0193e0";

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#94A3B8",
    fontFamily: "interRegular",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  headerRow: {
    position: "relative",
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    position: "absolute",
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    alignItems: "center",
    paddingHorizontal: 48,
  },

  headerTitle: {
    fontSize: 22,
    color: "#0F172A",
    fontFamily: "interSemiBold",
    letterSpacing: -0.2,
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    fontFamily: "interRegular",
    textAlign: "center",
  },

  editButton: {
    position: "absolute",
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  detailsCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
  },

  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "interRegular",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "interMedium",
    lineHeight: 22,
  },
});
