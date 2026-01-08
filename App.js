import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import { AuthProvider } from "./context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNav from "./navigation/mainNav";
import { RideProvider } from "./context/rideContext";

SplashScreen.setOptions({
    duration: 5000,
    fade: true,
});

const toastConfig = {
    success: (props) => <SuccessToast {...props} style={{ zIndex: 999, borderLeftColor: "green" }} text1Style={{ fontSize: 14, color: "green" }} />,
    error: (props) => <ErrorToast {...props} style={{ zIndex: 999, borderLeftColor: "red" }} text1Style={{ fontSize: 14, color: "red" }} />,
};

export default function App() {
    return (
        <AuthProvider>
                <RideProvider>
                    <SafeAreaProvider>
                        <MainNav />
                        <Toast config={toastConfig} topOffset={70} />
                    </SafeAreaProvider>
                </RideProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
