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
import util from 'util'

interface QuestionaryProps {
  questions: QuestionNode[];
  onFinish: (answers: boolean[]) => void;
}

const BackButton = styled(BaseButton)`
  background: transparent;
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

  const currentNode =
    index < answers.length
      ? props.questions[index]
      : props.questions[props.questions.length - 1];

  /** Stores an activity answer */
  const handleRadioSelect = useCallback(
    (option: number) => {
      const newAnswers = [...answers];
      newAnswers[index] = option;
      setAnswers(newAnswers);
      const next = index + 1;
      if (next < answers.length) setTimeout(() => setIndex(next), 500);
    },
    [index, answers]
  );

  useEffect(() => {
    if (answers[answers.length - 1] != undefined)
      props.onFinish(answers.map((el) => el == 0));
  }, [answers]);

  /** Moves to the previous activity node */
  const handleBackPressed = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  return currentNode ? (
    <>
      <Counter>
        {util.format(t('Question %s/%s'), index + 1, answers.length)}
      </Counter>
      <Md>{`# ${currentNode.question}`}</Md>
      <Notes>{currentNode.notes}</Notes>
      <RadioQuestions
        questions={[t("Yes"), t("No")]}
        onSelected={handleRadioSelect}
        selected={answers[index]}
      />
      <BackButton label={t("Back")} onPress={handleBackPressed} />
    </>
  ) : <></>;
};

export default Questionary;
