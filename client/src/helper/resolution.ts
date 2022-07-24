// create this utils.ts file
import { PixelRatio } from "react-native";
import { vw as vw_, vh as vh_ } from 'react-native-expo-viewport-units'

// dp(123) converts 123px (px as in your mockup design) to dp.
export const dp = (px: number) => {
  return Math.round((px * PixelRatio.get()) / 2.75);
};

// sp(54) converts 54px (px as in your mockup design) to sp
export const sp = (px: number) => {
  return Math.round(
    (px * (PixelRatio.getFontScale() * PixelRatio.get())) / 2.75
  );
};

export const vw = (value: number) => Math.round(vw_(value))
export const vh = (value: number) => Math.round(vh_(value))
