import React, { useState } from "react";
import { StatusBar, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen() {
  const { mrDriverPartnerSignin, eventLoading } = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()

  const handleSignIn = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      return Toast.show({
        type: "error",
        text2: "Enter a valid 10-digit mobile number.",
      });
    }

    if (!password || !mobileNumber || password.length < 6) {
      return Toast.show({
        type: "error",
        text2: "Please enter both Mobile Number and Password",
      });
    }

    try {
      await mrDriverPartnerSignin({
        mobileNumber: mobileNumber,
        pass: password,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.data || err.message);
      Toast.show({ type: "error", text2: "Something went wrong" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back, let’s get you on the road</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput placeholder="Mobile Number" placeholderTextColor="#6B7280" keyboardType="number-pad" maxLength={10} value={mobileNumber} onChangeText={setMobileNumber} style={styles.input} />

          <TextInput placeholder="Password" placeholderTextColor="#6B7280" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
        </View>

        <Text style={styles.forgotPassword}>Forgot password?</Text>

        <TouchableOpacity onPress={handleSignIn} activeOpacity={0.85} disabled={eventLoading} style={[styles.signInButton, eventLoading && styles.signInButtonDisabled]}>
          <Text style={styles.signInButtonText}>{eventLoading ? "Signing in..." : "Sign In"}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={styles.signUpText} onPress={() => navigation.navigate("sign-up")}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#0193e0";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    color: "#111827", // gray-900
    fontFamily: "interBold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#6B7280", // gray-500
    fontFamily: "interMedium",
    textAlign: "center",
  },
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
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 8,
    fontFamily: "interRegular",
  },
  forgotPassword: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "right",
    color: PRIMARY,
    fontFamily: "interSemiBold",
  },
  signInButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: PRIMARY,
  },
  signInButtonDisabled: {
    backgroundColor: "rgba(1,147,224,0.7)",
  },
  signInButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interMedium",
  },
  signUpText: {
    color: PRIMARY,
    fontFamily: "interSemiBold",
  },
});
