// create this utils.ts file
import { PixelRatio, Dimensions } from "react-native";
import { vw as vw_, vh as vh_ } from 'react-native-expo-viewport-units'

const winDimensions = Dimensions.get("window");
const appDimensions = [winDimensions.width, winDimensions.height];

const refDimensions = [320, 568]
const smallestDimension = refDimensions.indexOf(Math.min(...refDimensions));

const ratio = appDimensions[smallestDimension] /
              refDimensions[smallestDimension];

// dp(123) converts 123px (px as in your mockup design) to dp.
export const dp = (px: number) => {
  return Math.ceil((px * ratio) / 1);
};

// sp(54) converts 54px (px as in your mockup design) to sp
export const sp = (px: number) => {
  return Math.ceil(
    (px * (PixelRatio.getFontScale() * ratio)) / 1
  );
};

export const vw = (value: number) => Math.ceil(Dimensions.get('window').width * (value / 100))
export const vh = (value: number) => Math.ceil(Dimensions.get('window').height * (value / 100))
