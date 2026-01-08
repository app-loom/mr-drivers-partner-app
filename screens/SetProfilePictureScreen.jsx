import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/useAuth";
import { useNavigation } from "@react-navigation/native";

const PRIMARY = "#0193e0";

export default function SetProfilePictureScreen() {
  const { ownUser, setOwnUser, authPostFetch } = useAuth();
  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Gallery permission required",
        text2: "Please allow gallery access to upload a photo.",
        text2Style: { fontSize: 12 },
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Camera permission required",
        text2: "Please allow camera access to take a photo.",
        text2Style: { fontSize: 12 },
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (uploading) return;

    if (!image) {
      Toast.show({
        type: "error",
        text1: "Profile photo required",
        text2: "Please upload or capture a profile photo to continue.",
        text2Style: { fontSize: 12 },
      });
      return;
    }

    setUploading(true);

    try {
      const bodyTxt = {
        regiStatus: "drivlic",
        profilePicture: image,
      }
      const res = await authPostFetch("driver/update", bodyTxt);

      if (!res?.success) {
        Toast.show({
          type: "error",
          text1: "Upload failed",
          text2: res?.data?.message || "Please try again.",
        });
        return;
      }

      setOwnUser(res.data.data);
      navigation.navigate("add-driving-license");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: err?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Photo</Text>
          <Text style={styles.subtitle}>This helps riders recognize you easily</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>{image ? <Image source={{ uri: image }} style={styles.avatarImage} /> : <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />}</View>

          <View style={styles.actionRow}>
            <ActionButton icon="camera-outline" label="Camera" onPress={captureImage} />
            <ActionButton icon="image-outline" label="Gallery" onPress={pickImage} />
          </View>

          {image && (
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.removeText}>Remove photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.guidelines}>
          <Text style={styles.guidelineTitle}>Photo Guidelines</Text>

          <View style={styles.guidelineCard}>
            {["Use a clear, front-facing selfie", "Only you should be visible in the photo", "Accepted formats: JPG or PNG"].map((text, index) => (
              <View key={index} style={styles.guidelineRow}>
                <Ionicons name="checkmark-circle" size={18} color={PRIMARY} />
                <Text style={styles.guidelineText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.85} disabled={uploading} onPress={handleContinue} style={[styles.submitButton, uploading && styles.submitButtonDisabled]}>
          <Text style={styles.submitButtonText}>{uploading ? "Saving..." : "Continue"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


function ActionButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.actionButton}>
      <Ionicons name={icon} size={18} color={PRIMARY} />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    color: "#111827",
    fontFamily: "interBold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interMedium",
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 40,
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
  },

  actionRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "interSemiBold",
  },

  removeText: {
    marginTop: 12,
    fontSize: 14,
    color: "#EF4444",
    fontFamily: "interMedium",
  },

  guidelines: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  guidelineTitle: {
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
    fontFamily: "interSemiBold",
  },
  guidelineCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    fontFamily: "interMedium",
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: PRIMARY,
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(1,147,224,0.7)",
  },
  submitButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },
});
