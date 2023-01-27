import React, { useCallback, useEffect, useState } from "react";
import { QuestionNode } from "../../store/user";
import Title from "../atom/title";
import RawText from "../atom/text";
import RadioQuestions from "../molecule/radio-questions";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import BaseButton from "../atom/button";
import t from "../../pre-start/i18n";
import Md from "../molecule/md";
import util from "util";
import { answersProps } from "../../view/game";
import { View } from "react-native";
import AreaInput from "../molecule/area-input";

interface QuestionaryProps {
  questions: QuestionNode[];
  onFinish: (answers: answersProps[]) => void;
}

const BackButton = styled(BaseButton)`
  background: transparent;
  border: 1px solid ${(props) => props.theme.color.inputBorder};
`;

const NextButton = styled(BaseButton)`
  border: 1px solid ${(props) => props.theme.color.inputBorder};
`;

const Counter = styled(Title)`
  font-size: ${sp(16)}px;
  margin-bottom: ${dp(8)}px;
  color: ${(props) => props.theme.color.notes};
`;

const Notes = styled(RawText)`
  font-size: ${dp(14)}px;
  margin-top: ${dp(8)}px;
  margin-bottom: ${dp(28)}px;
  color: ${(props) => props.theme.color.notes};
`;

/** A form that shows boolean questions to answer */
const Questionary: React.VoidFunctionComponent<QuestionaryProps> = (props) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | undefined>>(
    new Array(props.questions.length).fill(undefined)
  );
  const [description, setDescription] = useState<Array<string>>(
    new Array(props.questions.length).fill("")
  );

  const [haveDescription, setHaveDescription] = useState(true);

  const currentNode =
    index < answers.length
      ? props.questions[index]
      : props.questions[props.questions.length - 1];

  /** Stores an activity answer */
  const handleRadioSelect = (option: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
    if (option != 2) {
      handleInputChange("");
      const next = index + 1;
      if (next < answers.length) setTimeout(() => setIndex(next), 500);
    } else {
      setHaveDescription(true);
    }
  };

  function handleInputChange(text: string) {
    const newDescription = [...description];
    newDescription[index] = text;
    return setDescription(newDescription);
  }

  const handleNext = () => {
    if (answers[answers.length - 1] == 2) {
      props.onFinish(
        answers.map((el, index) => {
          return {
            answer: el == 0 || el == 2,
            description: description[index],
          };
        })
      );
    } else {
      const next = index + 1;
      if (next < answers.length) setTimeout(() => setIndex(next), 500);
    }
  };

  useEffect(() => {
    if (
      answers[answers.length - 1] != undefined &&
      answers[answers.length - 1] != 2
    ) {
      props.onFinish(
        answers.map((el, index) => {
          return {
            answer: el == 0 || el == 2,
            description: description[index],
          };
        })
      );
    }
  }, [answers]);

  /** Moves to the previous activity node */
  const handleBackPressed = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  useEffect(() => {
    if (description[index] != "" || answers[index] == 2) {
      setHaveDescription(true);
    } else {
      setHaveDescription(false);
    }
  }, [index]);

  return currentNode ? (
    <>
      <Counter>
        {util.format(t("Question %s/%s"), index + 1, answers.length)}
      </Counter>
      <Md>{`# ${currentNode.question}`}</Md>
      <Notes>{currentNode.notes}</Notes>
      <RadioQuestions
        questions={[t("Yes"), t("No"), t("Other")]}
        onSelected={handleRadioSelect}
        selected={answers[index]}
      />
      <View style={{ height: 8 }} />

      {haveDescription && (
        <AreaInput
          labelProps={{
            style: {
              fontWeight: "bold",
              marginLeft: 0,
            },
          }}
          label={t(
            "Describe below what other behaviors the child demonstrated:"
          )}
          onChangeText={handleInputChange}
          value={description[index]}
        />
      )}

      {haveDescription && (
        <NextButton label={t("Next question")} onPress={handleNext} />
      )}
      <BackButton label={t("Back")} onPress={handleBackPressed} />
    </>
  ) : (
    <></>
  );
};

export default Questionary;
