import React from "react";
import { TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "outline";
  label: string;
  onPress: () => void;
}

const RawButton = styled(TouchableOpacity)<ButtonProps>`
  min-height: ${(props) => dp(38)}px;
  padding: ${(props) => dp(10)}px;
  border-radius: ${(props) => dp(20)}px;
  align-items: center;
  background: ${(props) => {
    switch (props.variant) {
      case "outline":
        return "transparent";
      default:
        return props.theme.color.primary;
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.variant) {
        case "outline":
          return props.theme.color.primary;
        default:
          return "transparent";
      }
    }};
  margin-top: ${(props) => dp(12)}px;
  justify-content: center;
`;

const Label = styled.Text`
  color: #000;
  font-weight: 400;
  font-size: ${(props) => sp(14)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`;

/** Clickable touchable opacity with text */
const Button: React.VoidFunctionComponent<ButtonProps> = (props) => {
  return (
    <RawButton
      {...props}
      variant={props.variant || props.disabled ? "outline" : undefined}
    >
      <Label>{props.label}</Label>
    </RawButton>
  );
};

export default Button;
