import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import SetProfilePictureScreen from "../screens/SetProfilePictureScreen";
import DrivingLicenseScreen from "../screens/DrivingLicenseScreen";
import SubmitScreen from "../screens/SubmitScreen";

const Stack = createStackNavigator();

function AuthStack({ initialRoute }) {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalFadeTransition,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="sign-in" component={SignInScreen} />
      <Stack.Screen name="sign-up" component={SignUpScreen} />
      <Stack.Screen name="verify-otp" component={VerifyOtpScreen} />
      <Stack.Screen name="complete-profile" component={CompleteProfileScreen} />
      <Stack.Screen name="set-profile-pic" component={SetProfilePictureScreen} />
      <Stack.Screen name="add-driving-license" component={DrivingLicenseScreen} />
      <Stack.Screen name="submit-application" component={SubmitScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
