import baseStyled, { ReactNativeStyledInterface } from 'styled-components/native'


const lightTheme = {
  color: {
    primary: "#FE918E",
    secondary: "#FFEFD7",
    background: "#fff",
    text: "#000",
    inputBorder: "#C4C4C4",
    hr: 'rgba(196, 196, 196, 0.24)',
    textProgress: '#99C957',
  },
  fontFamily: {
    text: "OpenSans_400Regular",
    title: "DMSans_700Bold",
    titleLight: "OpenSans_300Light",
    textBold: "OpenSans_700Bold",
  },
};

export const themes = {
  light: lightTheme,
};

export const defaultTheme = lightTheme;

export type Theme = typeof defaultTheme;
export default baseStyled as unknown as ReactNativeStyledInterface<Theme>;
