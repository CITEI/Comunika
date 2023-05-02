import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "./api";

/** Saves user's token */
export async function saveToken(token: string) {
  await AsyncStorage.setItem("access_token", token);
}

/** Removes user's token */
export async function clearToken() {
  await AsyncStorage.removeItem("onboarding");
  await AsyncStorage.removeItem("access_token");
}

/** Loads stored token */
export async function loadToken() {
  const token = await AsyncStorage.getItem("access_token");
  if (token) setToken(token);
}

/** Saves a flag to indicate that the user has already seen the tutorial */
export async function setOnboardingComplete() {
  await AsyncStorage.setItem("onboarding", "true");
}

/** Checks if the user has already seen the tutorial */
export async function isOnboardingComplete() {
  return (await AsyncStorage.getItem("onboarding")) == "true";
}
