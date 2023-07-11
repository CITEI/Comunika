import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Label from "../atom/inputLabel";
import Checkmark from "../atom/checkmark";
import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";

export interface CheckboxProps extends Omit<TouchableOpacityProps, "onPress"> {
  label: string;
  value?: boolean;
  editable?: boolean;
  onSelected: (selected: boolean) => void;
}

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: ${(props) => dp(12)}px;
`;

const Checkbox: React.VoidFunctionComponent<CheckboxProps> = (props) => {
  const editable = props.editable == undefined ? true : props.editable;
  const { onSelected, value, label, ...containerProps } = props;
  const [selected, setSelected] = useState(value || false);

  useEffect(() => {
    setSelected(value || false);
  }, [value]);

  const handlePress = useCallback(() => {
    if (editable) {
      const newValue = !selected;
      setSelected(newValue);
      onSelected(newValue);
    }
  }, [selected, onSelected, editable]);

  return (
    <Container {...containerProps} onPress={handlePress}>
      <Checkmark value={selected} onSelected={handlePress} />
      <Label style={{ marginLeft: dp(10) }}>{props.label}</Label>
    </Container>
  );
};

export default Checkbox;
