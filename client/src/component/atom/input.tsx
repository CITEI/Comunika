import styled from 'styled-components/native'
import React from "react";

const TextInput = styled.TextInput`
  margin: 5px 0 5px 0;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 2px;
`

interface InputProps {
  type?: "text" | "password" | "email";
  placeholder: string;
  onChangeText: (text: string) => void;
}

const Input: React.VoidFunctionComponent<InputProps> = (props) => {
  return (
    <TextInput
      {...props}
      secureTextEntry={props.type == "password"}
    ></TextInput>
  );
};

export default Input;
