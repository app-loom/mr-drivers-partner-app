import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StatusBar, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const { mrDriverPartnerSignup } = useAuth();

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const showError = (title, message) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      text1Style: { fontSize: 13 },
      text2Style: { fontSize: 12 },
    });
  };

  const handleSignUp = async () => {
    if (isLoading) return;

    if (!fullName.trim()) {
      return showError("Full name required", "Please enter your full name.");
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return showError("Invalid mobile number", "Please enter a valid 10-digit mobile number.");
    }

    if (password.length < 6) {
      return showError("Weak password", "Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return showError("Password mismatch", "Both passwords must be the same.");
    }

    setIsLoading(true);

    try {
      const bodyTxt = {
        fullName,
        mobileNumber,
        password,
        regiStatus: "verif",
      };

      const res = await mrDriverPartnerSignup(bodyTxt);

      console.log(res)

      if (!res?.data?.success) {
        showError("Signup failed", res?.data?.message || "Try again later.");
        return;
      }

      navigation.navigate("verify-otp");
    } catch (err) {
      showError("Something went wrong", "Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and start earning today</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} placeholderTextColor="#6B7280" style={styles.input} />

          <TextInput placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="number-pad" maxLength={10} placeholderTextColor="#6B7280" style={styles.input} />

          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#6B7280" style={styles.input} />

          <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor="#6B7280" style={styles.input} />
        </View>

        {/* Submit */}
        <TouchableOpacity onPress={handleSignUp} disabled={isLoading} activeOpacity={0.9} style={styles.buttonWrapper}>
          <LinearGradient colors={["#0193e0", "#00b4ff"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>{isLoading ? "Creating account..." : "Sign Up"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.signInText} onPress={() => navigation.navigate("sign-in")}>
            Sign In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#0193e0";

const styles = StyleSheet.create({
  /* Main */
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    color: "#111827",
    fontFamily: "interBold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "interMedium",
    textAlign: "center",
  },

  /* Inputs */
  inputGroup: {
    gap: 16,
  },
  input: {
    width: "100%",
    height: 56,
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#6B7280",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    fontFamily: "interRegular",
  },

  /* Button */
  buttonWrapper: {
    marginTop: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },

  /* Footer */
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interMedium",
  },
  signInText: {
    color: PRIMARY,
    fontFamily: "interSemiBold",
  },
});
