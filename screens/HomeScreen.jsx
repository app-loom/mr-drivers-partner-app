import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={require("../assets/images/getstarted.jpg")} resizeMode="cover" style={styles.imageBackground}>
        <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay} />

        <View style={styles.bottomCard}>
          <Text style={styles.title}>
            A Smarter Way{"\n"}
            <Text style={styles.highlight}>to Drive & Earn.</Text>
          </Text>

          <Text style={styles.description}>Receive verified trip requests, get assigned by dispatch, and focus on delivering safe, reliable rides without the chaos.</Text>

          <TouchableOpacity onPress={() => navigation.navigate("sign-up")} activeOpacity={0.9} style={styles.buttonWrapper}>
            <LinearGradient colors={["#0193e0", "#00b4ff"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text onPress={() => navigation.navigate("sign-in")} style={styles.signInText}>
              Sign in
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageBackground: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    textAlign: "center",
    color: "#111827",
    fontFamily: "interBold",
  },
  highlight: {
    color: "#0193e0",
  },
  description: {
    marginTop: 16,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: "#6B7280", 
    fontFamily: "interRegular",
  },
  buttonWrapper: {
    marginTop: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    fontFamily: "interBold",
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "interRegular",
  },
  signInText: {
    color: "#0193e0",
    fontFamily: "interMedium",
    textDecorationLine: "underline",
  },
});
