import React, { useCallback } from "react";
import VerticalContainer from "../atom/vertical-container";
import Input from "../atom/input";
import Button from "../atom/button";

interface FormProps {
  inputs: { type: "text" | "password"; label: string; name: string }[];
  buttonLabel?: string
  onSubmit: (values: Map<string, string>) => void;
}

/**
 * Creates a vertical list of inputs and sends their values to a function
 * whenever its submit button is clicked
 */
const Form: React.VoidFunctionComponent<FormProps> = (props) => {
  const [inputs, setInputs] = React.useState(new Map<string, string>());

  const handleChangeText = (name: string, text: string) => {
    setInputs(new Map(inputs.set(name, text)));
  };

  return (
    <VerticalContainer>
      {props.inputs.map((el) => (
        <Input
          key={el.name}
          type={el.type}
          placeholder={el.label}
          onChangeText={useCallback(
            (text: string) => handleChangeText(el.name, text),
            []
          )}
        />
      ))}
      <Button
        title={props.buttonLabel || "Send"}
        onPress={useCallback(() => props.onSubmit(inputs), [])}
      />
    </VerticalContainer>
  );
};

export default Form;
