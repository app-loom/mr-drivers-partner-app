import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/useAuth";
import { useNavigation } from "@react-navigation/native";

const CELL_COUNT = 4;
const PRIMARY = "#0193e0";

export default function VerifyOtpScreen() {
  const { ownUser, setOwnUser, authPostFetch } = useAuth();

  const navigation = useNavigation();

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  const showError = (title, message) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      text1Style: { fontSize: 13 },
      text2Style: { fontSize: 12 },
    });
  };

  const handleVerify = async () => {
    if (isVerifying) return;

    if (otp.length !== CELL_COUNT) {
      return showError("Invalid code", "Please enter the complete 4-digit OTP.");
    }

    setIsVerifying(true);

    const bodyTxt = {
      mobileNumber: ownUser?.mobileNumber,
      otp,
      regiStatus: "comprof",
    };

    try {
      const res = await authPostFetch("driver/verifyotp", bodyTxt);
      if (!res?.success) {
        return showError("Verification failed", res?.data?.message);
      }

      setOwnUser(res.data);

      Toast.show({
        type: "success",
        text1: "Verified successfully",
        text2: "Your mobile number has been verified.",
        text2Style: { fontSize: 12 },
      });

      setTimeout(() => {
        navigation.navigate("complete-profile");
      }, 1200);
    } catch (err) {
      showError("Verification failed", err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    Toast.show({
      type: "info",
      text1: "OTP resent",
      text2: "Please check your mobile for the new code.",
      text2Style: { fontSize: 12 },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.subtitle}>Enter the 4-digit code sent to</Text>

          <Text style={styles.mobile}>{ownUser?.mobileNumber}</Text>
        </View>

        <View style={styles.codeFieldWrapper}>
          <CodeField
            ref={ref}
            {...props}
            value={otp}
            onChangeText={setOtp}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            rootStyle={styles.codeFieldRoot}
            renderCell={({ index, symbol, isFocused }) => (
              <View key={index} onLayout={getCellOnLayoutHandler(index)} style={[styles.cell, isFocused ? styles.cellFocused : styles.cellDefault]}>
                <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn’t receive the code?</Text>
          <Text onPress={handleResend} style={styles.resendAction}>
            Resend
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} disabled={isVerifying} onPress={handleVerify} style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}>
          <Text style={styles.verifyButtonText}>{isVerifying ? "Verifying..." : "Verify"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    color: "#111827",
    fontFamily: "interBold",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 18,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interMedium",
  },
  mobile: {
    marginTop: 4,
    fontSize: 16,
    color: PRIMARY,
    fontFamily: "interSemiBold",
  },

  codeFieldWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  codeFieldRoot: {
    justifyContent: "center",
  },
  cell: {
    width: 56,
    height: 56,
    marginHorizontal: 4,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  cellDefault: {
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  cellFocused: {
    borderColor: PRIMARY,
    backgroundColor: "rgba(1,147,224,0.05)",
  },
  cellText: {
    fontSize: 20,
    color: "#111827",
    fontFamily: "interSemiBold",
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "interMedium",
  },
  resendAction: {
    marginLeft: 8,
    fontSize: 14,
    color: PRIMARY,
    fontFamily: "interSemiBold",
  },

  verifyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: PRIMARY,
  },
  verifyButtonDisabled: {
    backgroundColor: "rgba(1,147,224,0.7)",
  },
  verifyButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },
});
