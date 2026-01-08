import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/useAuth";

export default function ViewDocumentsScreen() {
  const { ownUser } = useAuth();
  const navigation = useNavigation();

  const license = ownUser?.drivingLicence;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={PRIMARY} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Uploaded Documents</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="car-outline" size={20} color={PRIMARY} />
            </View>
            <Text style={styles.cardTitle}>Driving Licence</Text>
          </View>

          {license ? (
            <>
              <View style={styles.licenceInfo}>
                <Text style={styles.licenceLabel}>Licence Number</Text>
                <Text style={styles.licenceValue}>{license.drivingLicenseNo}</Text>
              </View>

              <View style={styles.imagesRow}>
                <DocumentImage uri={license.frontImage} label="Front Side" />
                <DocumentImage uri={license.backImage} label="Back Side" />
              </View>
            </>
          ) : (
            <EmptyState text="Driving licence details not available" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function DocumentImage({ uri, label }) {
  return (
    <View style={styles.documentWrapper}>
      {uri ? (
        <Image source={{ uri }} style={styles.documentImage} resizeMode="cover" />
      ) : (
        <View style={styles.documentPlaceholder}>
          <Ionicons name="image-outline" size={24} color="#9CA3AF" />
          <Text style={styles.placeholderText}>No image uploaded</Text>
        </View>
      )}

      <Text style={styles.documentLabel}>{label}</Text>
    </View>
  );
}

function EmptyState({ text }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={32} color="#9CA3AF" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const PRIMARY = "#0193e0";

const styles = StyleSheet.create({
  /* Main */
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* Header */
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

  headerTitle: {
    fontSize: 22,
    color: "#0F172A",
    fontFamily: "interSemiBold",
    letterSpacing: -0.2,
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    marginLeft: 10,
    fontSize: 17,
    color: "#0F172A",
    fontFamily: "interMedium",
  },

  /* Licence Info */
  licenceInfo: {
    marginBottom: 16,
  },

  licenceLabel: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "interRegular",
  },

  licenceValue: {
    marginTop: 4,
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "interMedium",
  },

  /* Images */
  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  documentWrapper: {
    width: "48%",
  },

  documentImage: {
    width: "100%",
    height: 176,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
  },

  documentPlaceholder: {
    width: "100%",
    height: 176,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    marginTop: 6,
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "interRegular",
  },

  documentLabel: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    color: "#64748B",
    fontFamily: "interRegular",
  },

  /* Empty State */
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#94A3B8",
    fontFamily: "interRegular",
  },
});
