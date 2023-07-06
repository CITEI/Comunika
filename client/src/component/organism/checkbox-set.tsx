import { View, ViewProps } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";
import Checkbox from "../molecule/checkbox";
import InputLabel from "../atom/input-label";

export interface CheckboxSetProps extends ViewProps {
  onSelectionChange: (selected: string[]) => void;
  options: { option: string; value: string }[];
  label: string;
  editable?: boolean;
  selected?: string[];
}

const Container = styled(View)`
  border-radius: ${(props) => dp(18)}px;
  border: 1px solid ${(props) => props.theme.color.inputBorder};
  padding-top: ${(props) => dp(11)}px;
  padding-bottom: ${(props) => dp(11)}px;
  padding-left: ${(props) => dp(3)}px;
  padding-right: ${(props) => dp(3)}px;
  margin-top: ${(props) => dp(12)}px;
  margin-bottom: ${dp(16)}px;
`;

const Label = styled(InputLabel)`
  margin-left: ${dp(14)}px;
  margin-bottom: ${dp(5)}px;
`;

/** Multiple checkbox selection box */
const CheckboxSet: React.VoidFunctionComponent<CheckboxSetProps> = (props) => {
  const [selected, setSelected] = useState(
    new Set<string>(props.selected || [])
  );

  const handleSelected = useCallback(
    (option: string, value: boolean) => {
      if (value) setSelected(new Set(selected.add(option)));
      else {
        selected.delete(option);
        setSelected(new Set(selected));
      }
    },
    [selected]
  );

  useEffect(() => {
    props.onSelectionChange(Array.from(selected));
  }, [selected, props.onSelectionChange]);

  return (
    <Container>
      <Label>{props.label}</Label>
      {props.options.map((option) => (
        <Checkbox
          label={option.option}
          key={option.value}
          onSelected={(selected) => handleSelected(option.value, selected)}
          value={selected.has(option.value)}
          editable={props.editable}
        />
      ))}
    </Container>
  );
};

export default CheckboxSet;
