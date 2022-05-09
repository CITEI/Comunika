import React, { useCallback } from "react";
import { Text } from "react-native";
import Button from "../atom/button";
import { FullView } from "../atom/full-view";
import styled from 'styled-components/native'


const Question = styled.Text`
  flex: 1;
`

interface QuestionProps {
  title: string;
  question: string;
  onAnswer: (answer: boolean) => void;
}

const QuestionNode: React.VoidFunctionComponent<QuestionProps> = (props) => {
  return (
    <FullView>
      <Text style={{fontWeight: 'bold'}}>{props.title}</Text>
      <Question>{props.question}</Question>
      <Button
        title="Yes"
        onPress={useCallback(() => props.onAnswer(true), [props.onAnswer])}
      ></Button>
      <Button
        title="No"
        style={{marginTop: '5px'}}
        onPress={useCallback(() => props.onAnswer(false), [props.onAnswer])}
      ></Button>
    </FullView>
  );
};

export default QuestionNode;
