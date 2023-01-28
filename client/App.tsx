import store from "./src/store/store";
import Login from "./src/view/login";
import ForgotPass from "./src/view/forgot-pass";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./src/view/register";
import React from "react";
import FlashMessage from "react-native-flash-message";
import Main from "./src/view/main";
import Stages from "./src/view/stages";
import Game from "./src/view/game";
import Result from "./src/view/result";
import { APP_NAME } from "./src/pre-start/constants";
import Settings, { SettingsButton } from "./src/view/settings";
import { defaultTheme } from "./src/pre-start/themes";
import { ThemeProvider } from "styled-components/native";
import FontLoader from "./src/pre-start/font-loader";
import MainContainer from "./src/component/atom/main-container";
import Transition from "./src/view/transition";
import Onboarding from "./src/view/onboarding";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <FontLoader>
        <ThemeProvider theme={defaultTheme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                component={Login}
                name="Login"
                options={{ title: APP_NAME }}
              />
              <Stack.Screen
                component={Register}
                name="Register"
                options={{ title: APP_NAME }}
              />
              <Stack.Screen
                component={Onboarding}
                name="Onboarding"
                options={{ title: APP_NAME }}
              />
              <Stack.Screen
                component={Main}
                name="Main"
                options={{
                  title: APP_NAME,
                  headerRight: SettingsButton,
                }}
              />
              <Stack.Screen
                component={ForgotPass}
                name="ForgotPass"
                options={{
                  title: APP_NAME,
                  headerRight: SettingsButton,
                }}
              />
              <Stack.Screen component={Stages} name="Stages" />
              <Stack.Screen component={Game} name="Game" />
              <Stack.Screen component={Result} name="Result" />
              <Stack.Screen component={Settings} name="Settings" />
              <Stack.Screen component={Transition} name="Transition" />
            </Stack.Navigator>
          </NavigationContainer>
          <FlashMessage position="bottom" />
        </ThemeProvider>
      </FontLoader>
    </Provider>
  );
}
