import React from "react";
import { dp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import RawInput, { InputProps as RawInputProps } from "../atom/input";
import InputLabel from "../atom/inputLabel";

export interface InputProps extends RawInputProps {
  label: string;
}

const Container = styled.View`
  margin-bottom: ${(props) => dp(16)}px;
`;

/** Labelled input field */
const Input: React.VoidFunctionComponent<InputProps> = (props) => {
  const { label, ...inputProps } = props;

  return (
    <Container>
      <InputLabel>{props.label}</InputLabel>
      <RawInput {...inputProps}></RawInput>
    </Container>
  );
};

export default Input;
