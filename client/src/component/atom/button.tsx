import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";
import {dp, sp} from "../../helper/resolution";


interface StyledButtonProps extends TouchableOpacityProps {
  variant?: "outline";
  title: string;
  onPress: () => void;
}

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
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

const StyledText = styled.Text`
  color: #000;
  font-weight: 400;
  font-size: ${(props) => sp(14)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`;

const Button: React.VoidFunctionComponent<StyledButtonProps> = (
  props
) => {
  return (
    <StyledButton {...props}>
      <StyledText>{props.title}</StyledText>
    </StyledButton>
  );
};

export default Button;
