import React from 'react'
import { useFonts, OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans";

export default function FontLoader() {
  const [_fontsLoaded, fontsError] = useFonts({
    OpenSans_400Regular,
    DMSans_700Bold,
  });

  if (fontsError) {
    throw fontsError;
  }

  return (
    <></>
  )
}