import React, { useCallback, useState } from "react";
import styled from "../../pre-start/themes";
import ShadowPanel, { ShadowPanelProps } from "./shadowPanel";
import { dp } from "../../helper/resolution";
import BaseText from "./text";

interface QuestionRadioProps extends ShadowPanelProps {
  /** Radio text */
  option: string;
  /** Whether the radio is checked */
  selected: boolean;
  /** Index of the radio in the list */
  index: number;
  /** Callback called whenever a checkmark is selected */
  onSelect: (index: number) => void;
}

interface CheckmarkProps {
  selected: boolean;
}

const Container = styled(ShadowPanel)<CheckmarkProps>`
  border-radius: ${dp(5)}px;
  border: 1px solid
    ${(props) => (props.selected ? props.theme.color.primary : "transparent")};
  padding: ${dp(10)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Checkmark = styled.TouchableOpacity<CheckmarkProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.color.primary : props.theme.color.inputBorder};
  border-radius: ${dp(20)}px;
  width: ${dp(20)}px;
  height: ${dp(20)}px;
  margin-right: ${dp(14)}px;
`;

const Text = styled(BaseText)`
  flex: 1;
`;

/** Radio button for questionary */
const QuestionRadio: React.VoidFunctionComponent<QuestionRadioProps> = (
  props
) => {
  /** Calls the onSelect callback when a radio is pressed */
  const handlePress = useCallback(() => {
    props.onSelect(props.index);
  }, [props.selected, props.index, props.onSelect]);

  return (
    <Container {...props}>
      <Checkmark selected={props.selected} onPress={handlePress} />
      <Text>{props.option}</Text>
    </Container>
  );
};

export default QuestionRadio;
