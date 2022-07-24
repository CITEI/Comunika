import styled from "styled-components/native";
import React, { useCallback } from "react";
import { View } from "react-native";
import { dp, sp } from "../../helper/resolution";

const StyledView = styled.View`
  margin-bottom: ${(props) => dp(8)}px;
`;

const StyledInput = styled.TextInput`
  margin: 5px 0 5px 0;
  height: ${(props) => dp(36)}px;
  padding: ${(props) => dp(10)}px;
  margin-top: ${(props) => dp(8)}px;
  margin-bottom: 0;
  border-radius: ${(props) => dp(18)}px;
  border: 1px solid
    ${(props) =>
      props.focused
        ? props.theme.color.primary
        : props.theme.color.inputBorder};
  justify-content: center;
`;

const StyledLabel = styled.Text`
  font-size: ${(props) => sp(13)}px;
  margin-left: 15px;
  margin-top: ${(props) => dp(4)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`;

interface InputProps {
  type?: "text" | "password" | "email";
  label: string;
  onChangeText: (text: string) => void;
}

const Input: React.VoidFunctionComponent<InputProps> = (props) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <StyledView>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledInput
        {...props}
        onFocus={useCallback(() => setIsFocused(true), [])}
        onBlur={useCallback(() => setIsFocused(false), [])}
        focused={isFocused}
        secureTextEntry={props.type == "password"}
      ></StyledInput>
    </StyledView>
  );
};

export default Input;
