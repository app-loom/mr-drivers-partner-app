import React, { useRef } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../context/useAuth";
import { NavigationContainer } from "@react-navigation/native";
import LoadStack from "./loadStack";
import AppStack from "./appStack";
import AuthStack from "./authStack";

function MainNav() {
  const navigationRef = useRef();
  const { accessToken, isInitLoading, initialRoute } = useAuth();

  return <NavigationContainer ref={navigationRef}>{isInitLoading ? <LoadStack /> : accessToken !== null && initialRoute == null ? <AppStack /> : <AuthStack initialRoute={initialRoute} />}</NavigationContainer>;
}

export default MainNav;
