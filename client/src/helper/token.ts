import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToken(token: string) {
  await AsyncStorage.setItem("access_token", token);
}

export async function getToken({ removeBearer }: { removeBearer: boolean }) {
  const token = await AsyncStorage.getItem("access_token");
  if (token) if (removeBearer) return token.split("Bearer ")[1];
  return token;
}
