import { View, Text, ViewProps } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BaseQuestionRadio from "../atom/questionRadio";
import { dp } from "../../helper/resolution";
import styled from "../../pre-start/themes";

interface RadioQuestionsProps extends ViewProps {
  questions: string[];
  selected?: number;
  onSelected: (index: number) => void;
}

const QuestionRadio = styled(BaseQuestionRadio)`
  margin-bottom: ${dp(12)}px;
`;

const RadioQuestions: React.VoidFunctionComponent<RadioQuestionsProps> = (
  props
) => {
  const [selected, setSelected] = useState(props.selected);

  useEffect(() => {
    setSelected(props.selected);
  }, [props]);

  const handleOnSelect = useCallback(
    (index: number) => {
      setSelected(index);
      props.onSelected(index);
    },
    [props.onSelected]
  );

  return (
    <View {...props}>
      {props.questions.map((el, i) => (
        <QuestionRadio
          option={el}
          key={i}
          onSelect={handleOnSelect}
          selected={i == selected}
          index={i}
        />
      ))}
    </View>
  );
};

export default RadioQuestions;
