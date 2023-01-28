import React, { useCallback, useEffect, useState } from "react";
import VerticalContainer from "../atom/vertical-container";
import Input, { InputProps } from "../molecule/input";
import PasswordInput, { PasswordInputProps } from "../molecule/password-input";
import Checkbox, { CheckboxProps } from "../molecule/checkbox";
import Button, { ButtonProps } from "../atom/button";
import DateInput, { DateInputProps } from "../molecule/date-input";
import CheckboxSet, { CheckboxSetProps } from "./checkbox-set";
import { ViewProps } from "react-native";

import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";

interface SubmitProps extends Omit<ButtonProps, "onPress"> {
  onSubmit: (map: Map<string, string>) => void;
}

type PartialSingle<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type SubmitConstructor = { name: string; type: "submit" } & SubmitProps;
type InputConstructor = { name: string } & (
  | ({ type: "text" } & PartialSingle<InputProps, "onChangeText">)
  | ({ type: "password" } & PartialSingle<PasswordInputProps, "onChangeText">)
  | ({ type: "checkbox" } & PartialSingle<CheckboxProps, "onSelected">)
  | ({ type: "button" } & ButtonProps)
  | ({ type: "date" } & PartialSingle<DateInputProps, "onChangeDate">)
  | ({ type: "code" } & { input: InputProps; button: ButtonProps })
  | ({ type: "checkboxset" } & PartialSingle<
      CheckboxSetProps,
      "onSelectionChange"
    >)
  | SubmitConstructor
);

interface FormProps extends ViewProps {
  inputs: InputConstructor[];
  onChange?: (map: Map<string, any>) => void;
}

const DoNothing = (...args) => {};

const BoxColumn = styled.View`
  display: flex;
  flex-direction: row;
`;

/**
 * Creates a vertical list of inputs and sends their values to a function
 * whenever a submit button is clicked
 */
const Form: React.VoidFunctionComponent<FormProps> = (props) => {
  const { inputs: constructors, onChange, ...viewProps } = props;
  const [inputs, setInputs] = useState(new Map<string, any>());

  const handleChange = useCallback(
    (key: string, val: any, callback?: (val: any) => void) => {
      if (
        val &&
        (!inputs.has(key) || inputs.get(key).toString() != val.toString())
      ) {
        setInputs(new Map(inputs.set(key, val)));
        (callback || DoNothing)(val);
      } else if (!val && inputs.has(key)) {
        inputs.delete(key);
        setInputs(new Map(inputs));
      }
    },
    [inputs]
  );

  useEffect(() => {
    props.onChange?.(inputs);
  }, [inputs, props.onChange]);

  const generateChild = (el: InputConstructor) => {
    const { type, name, ...rest } = el;
    rest["key"] = name;
    switch (type) {
      case "text": {
        const elProps = rest as InputProps;
        return (
          <Input
            {...elProps}
            onChangeText={(txt) =>
              handleChange(name, txt, elProps.onChangeText)
            }
          />
        );
      }
      case "password": {
        const elProps = rest as PasswordInputProps;
        return (
          <PasswordInput
            {...elProps}
            onChangeText={(txt) =>
              handleChange(name, txt, elProps.onChangeText)
            }
          />
        );
      }
      case "checkbox": {
        const elProps = rest as CheckboxProps;
        return (
          <Checkbox
            {...elProps}
            onSelected={(check) =>
              handleChange(name, check, elProps.onSelected)
            }
          />
        );
      }
      case "button": {
        const elProps = rest as ButtonProps;
        return <Button {...elProps} />;
      }
      case "date": {
        const elProps = rest as DateInputProps;
        return (
          <DateInput
            {...elProps}
            onChangeDate={(date) =>
              handleChange(name, date, elProps.onChangeDate)
            }
          />
        );
      }
      case "submit": {
        const elProps = rest as SubmitProps;
        return <Button {...elProps} onPress={() => el.onSubmit(inputs)} />;
      }
      case "checkboxset": {
        const elProps = rest as CheckboxSetProps;
        return (
          <CheckboxSet
            {...elProps}
            onSelectionChange={(selected) =>
              handleChange(name, selected, elProps.onSelectionChange)
            }
          />
        );
      }

      case "code": {
        const { input, button } = rest as {
          input: InputProps;
          button: ButtonProps;
        };
        return (
          <BoxColumn>
            <Input
              {...input}
              style={{
                width: 250,
                marginRight: dp(4),

                textAlign: "center",
                textAlignVertical: "center",
              }}
              onChangeText={(txt) =>
                handleChange(name, txt, input.onChangeText)
              }
            />
            <Button
              {...button}
              style={{
                flex: 1,
                marginTop: dp(24),
                marginLeft: dp(4),
                height: dp(36),
              }}
            />
          </BoxColumn>
        );
      }
      default:
        throw new Error("Invalid input type");
    }
  };

  return (
    <VerticalContainer {...viewProps}>
      {constructors.map(generateChild)}
    </VerticalContainer>
  );
};

export default Form;
