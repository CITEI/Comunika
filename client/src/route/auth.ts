import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthProps = {
  Register: undefined;
  Login: undefined;
  Main: undefined;
  ForgotPass: undefined;
  ResetPass: {
    email: string;
  };
  Onboarding: undefined;
};

export type AuthNavigatorProps = NativeStackNavigationProp<AuthProps>;
