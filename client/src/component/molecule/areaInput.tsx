import styled from "../../pre-start/themes";
import React, { useState, useEffect, useCallback } from "react";
import { dp } from "../../helper/resolution";
import MaskedInput, { MaskInputProps } from "react-native-mask-input";
import InputLabel, { LabelProps } from "../atom/inputLabel";

const MaskInput = styled(MaskedInput).attrs(
  (props: { focused: boolean }) => props
)`
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

export interface AreaInputProps extends Omit<MaskInputProps, "value"> {
  onChangeText: (text: string) => void;
  value: string;
  label?: string;
  labelProps?: LabelProps;
}

const Container = styled.View`
  margin-top: ${(props) => dp(12)}px;
  margin-bottom: ${(props) => dp(8)}px;
`;
/** A component that receives user information. */
const AreaInput: React.VoidFunctionComponent<AreaInputProps> = (props) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Container>
      <InputLabel {...props.labelProps}>{props.label}</InputLabel>
      <MaskInput
        {...props}
        onChangeText={props.onChangeText}
        onFocus={useCallback(() => setIsFocused(true), [])}
        onBlur={useCallback(() => setIsFocused(false), [])}
        focused={isFocused}
        multiline
        style={{
          height: dp(130),
          textAlignVertical: "top",
          borderRadius: dp(5),
        }}
        value={props.value}
      ></MaskInput>
    </Container>
  );
};

export default AreaInput;
