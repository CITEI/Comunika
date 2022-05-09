import React from "react";
import { Button as RButton, View, ViewStyle } from "react-native";

export interface ButtonProps {
  title: string;
  style?: ViewStyle;
  onPress: () => void;
}

const Button: React.VoidFunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return <View style={props.style}><RButton {...props}></RButton></View>;
};

export default Button
