// create this utils.ts file
import { PixelRatio } from "react-native";
import { vw as vw_, vh as vh_ } from 'react-native-expo-viewport-units'

// dp(123) converts 123px (px as in your mockup design) to dp.
export const dp = (px: number) => {
  return Math.ceil((px * PixelRatio.get()) / 2.25);
};

// sp(54) converts 54px (px as in your mockup design) to sp
export const sp = (px: number) => {
  return Math.ceil(
    (px * (PixelRatio.getFontScale() * PixelRatio.get())) / 2.25
  );
};

export const vw = (value: number) => Math.ceil(vw_(value))
export const vh = (value: number) => Math.ceil(vh_(value))
