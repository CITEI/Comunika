import React, { ReactElement } from "react";
import { useFonts, OpenSans_400Regular, OpenSans_700Bold } from "@expo-google-fonts/open-sans";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans";

interface FontLoaderProps {
  children: ReactElement;
}

const FontLoader: React.FunctionComponent<FontLoaderProps> = (props) => {
  const [fontsLoaded, fontsError] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    DMSans_700Bold,
  });

  if (fontsError) throw fontsError;

  if (fontsLoaded) return props.children;
  else return <></>;
};

export default FontLoader;
