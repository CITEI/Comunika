import styled from "../../pre-start/themes"
import React, { useState, useEffect, useCallback } from "react";
import { dp, sp } from "../../helper/resolution";
import MaskedInput, { MaskInputProps } from 'react-native-mask-input'

const MaskInput = styled(MaskedInput).attrs((props: {focused: boolean}) => props)`
  font-size: ${sp(12)}px;
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

export interface InputProps extends Omit<MaskInputProps, "value"> {
  onChangeText: (text: string) => void;
  value?: string;
}

/** A component that receives user information. */
const Input: React.VoidFunctionComponent<InputProps> = (props) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = useState(props.value || "");

  const handleOnChangeText = useCallback((masked: string, unmasked: string) => {
    setText(masked);
  }, [props.onChangeText]);

  useEffect(() => {
    props.onChangeText(text);
  }, [text, props.onChangeText])

  return (
    <MaskInput
      {...props}
      onChangeText={handleOnChangeText}
      onFocus={useCallback(() => setIsFocused(true), [])}
      onBlur={useCallback(() => setIsFocused(false), [])}
      focused={isFocused}
      value={text}
    ></MaskInput>
  );
};

export default Input;
