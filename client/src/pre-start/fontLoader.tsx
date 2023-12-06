import React, { ReactElement } from "react";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from "@expo-google-fonts/open-sans";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { Inter_700Bold } from "@expo-google-fonts/inter";

interface FontLoaderProps {
  children: ReactElement;
}

const FontLoader: React.FunctionComponent<FontLoaderProps> = (props) => {
  const [fontsLoaded, fontsError] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    DMSans_700Bold,
    Inter_700Bold,
  });

  if (fontsError) throw fontsError;

  if (fontsLoaded) return props.children;
  else return <></>;
};

export default FontLoader;
