import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/useAuth";

export default function EditProfileScreen({ navigation }) {
  const { ownUser, setOwnUser, authPostFetch } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fullName, setFullName] = useState(ownUser?.fullName || "");

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const bodyTxt = {
      driverId: ownUser._id,
      fullName,
    };

    const res = await authPostFetch("driver/update", bodyTxt);
    if (res?.success) {
      setOwnUser(res.data);
    }

    navigation.goBack();
  };

  if (!ownUser) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No user details available.</Text>
      </SafeAreaView>
    );
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeleting(true);

      const res = await authPostFetch("driver/deleteAccount", bodyTxt);
      setOwnUser(null);

      navigation.reset({
        index: 0,
        routes: [{ name: "sign-in" }],
      });
    } catch (err) {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={PRIMARY} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="person-outline" size={20} color={PRIMARY} />
              <Text style={styles.labelText}>Full Name</Text>
            </View>

            <TextInput value={fullName} onChangeText={setFullName} placeholder="Enter your full name" placeholderTextColor="#9CA3AF" style={styles.input} />
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showDeleteModal} transparent animationType="fade" statusBarTranslucent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Delete Account</Text>

              <Text style={styles.modalDescription}>This action is permanent and cannot be undone. Are you sure you want to continue?</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setShowDeleteModal(false)} disabled={deleting} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={confirmDeleteAccount} disabled={deleting} style={styles.confirmButton}>
                  <Text style={styles.confirmText}>{deleting ? "Please wait..." : "Delete"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#0193e0";

const styles = StyleSheet.create({
  /* Empty State */
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

  /* Main */
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
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
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  /* Input */
  inputGroup: {
    marginBottom: 24,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  labelText: {
    marginLeft: 8,
    color: "#475569",
    fontFamily: "interMedium",
    fontSize: 13,
  },

  input: {
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontFamily: "interRegular",
    fontSize: 15,
  },

  /* Buttons */
  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "interSemiBold",
  },

  deleteButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    fontSize: 15,
    color: "#DC2626",
    fontFamily: "interMedium",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#0F172A",
    fontFamily: "interSemiBold",
  },

  modalDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#64748B",
    fontFamily: "interRegular",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#334155",
    fontFamily: "interMedium",
  },

  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmText: {
    color: "#FFFFFF",
    fontFamily: "interSemiBold",
  },
});
