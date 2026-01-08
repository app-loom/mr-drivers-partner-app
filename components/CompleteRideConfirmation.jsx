import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRide } from "../context/useRide";

const SUCCESS = "#16A34A";

export default function CompleteRideConfirmation({ visible, onClose, onConfirm, elapsed }) {
  const { formatTime } = useRide()
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Ionicons name="flag-outline" size={16} color={SUCCESS} />
            </View>
          </View>

          <Text style={styles.title}>Complete Trip</Text>

          <Text style={styles.description}>This will stop the trip timer and proceed to payment collection.</Text>

          <View style={styles.timeWrapper}>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>Total Trip Time</Text>
              <Text style={styles.timeValue}>{formatTime(elapsed)}</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>Complete Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  iconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#111827",
    fontFamily: "interBold",
  },

  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#4B5563",
    fontFamily: "interMedium",
  },

  timeWrapper: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  timeCard: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  timeLabel: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interMedium",
  },
  timeValue: {
    marginTop: 4,
    fontSize: 36,
    textAlign: "center",
    color: "#111827",
    fontFamily: "interBold",
    letterSpacing: -0.5,
  },

  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: SUCCESS,
    shadowColor: SUCCESS,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },

  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interSemiBold",
  },
});
