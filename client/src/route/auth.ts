import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthProps = {
  Register: undefined;
  Login: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthNavigatorProps = NativeStackNavigationProp<AuthProps>;
