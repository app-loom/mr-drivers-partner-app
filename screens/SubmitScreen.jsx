import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0193E0";

export default function SubmitScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark" size={40} color={'#fff'} />
        </View>

        <Text style={styles.title}>Application submitted</Text>

        <Text style={styles.description}>Your application has been successfully submitted and is now under verification.</Text>

        <Text style={styles.descriptionSecondary}>
          We’ll get back to you within <Text style={styles.highlight}>48 working hours</Text>.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("home")} style={styles.button}>
          <Text style={styles.buttonText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#0193E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: "center",
    color: "#0F172A",
    fontFamily: "interSemiBold",
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    color: "#475569",
    fontFamily: "interRegular",
    marginBottom: 8,
  },

  descriptionSecondary: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#64748B",
    fontFamily: "interRegular",
  },

  highlight: {
    color: "#0F172A",
    fontFamily: "interMedium",
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "interSemiBold",
  },
});
