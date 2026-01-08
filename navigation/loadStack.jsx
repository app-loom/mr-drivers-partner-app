import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function LoadStack() {
    return (
        <View style={styles.container}>
            <LottieView autoPlay style={styles.loadingLottie} source={require("../assets/anime/loading.json")} />
            <Text>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingLottie: {
        width: 100,
        height: 100,
    },
});

export default LoadStack;
