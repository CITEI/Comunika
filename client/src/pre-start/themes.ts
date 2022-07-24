import { createGlobalStyle, DefaultTheme } from "styled-components";


const lightTheme: DefaultTheme = {
  borderColor: {
  },
  color: {
    primary: "#fe918e",
    background: "#fff",
    text: "#000",
    inputBorder: "#C4C4C4",
  },
  fontFamily: {
    text: "OpenSans_400Regular",
    title: "DMSans_700Bold",
  },
};

export const themes = {
  light: lightTheme,
};

export const defaultTheme = lightTheme;
