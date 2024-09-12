import React, { useCallback, useEffect, useState } from "react";
import AreaInput from "../molecule/areaInput";
import { QuestionNode } from "../../store/progress";
import Title from "../atom/title";
import RawText from "../atom/text";
import RadioQuestions from "../molecule/radioQuestions";
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";
import BaseButton from "../atom/button";
import t from "../../pre-start/i18n";
import Md from "../molecule/md";
import util from "util";

interface QuestionaryProps {
  id: string;
  questions: QuestionNode[];
  onFinish: (answers: (string | boolean)[]) => void;
}

const BackButton = styled(BaseButton)`
  margin-top: ${dp(4)}px;
  margin-bottom: ${dp(13)}px;
  padding: ${dp(3)}px;
  padding-right: ${dp(17)}px;
  padding-left: ${dp(17)}px;
  background: transparent;
  min-height: ${dp(32)}px;
  color: ${(props) => props.theme.color.notes};
  font-size: ${sp(14)}px;
  border: 1px solid ${(props) => props.theme.color.backButtonBorder};
  width: ${dp(100)}px;
`;

const Counter = styled(RawText)`
  margin-bottom: ${dp(13)}px;
  margin-top: ${dp(30)}px;
`;

const CounterCurrent = styled(Title)`
  font-family: ${(props) => props.theme.fontFamily.textBold};
  font-size: ${sp(16)}px;
  margin-bottom: ${dp(8)}px;
  color: ${(props) => props.theme.color.notes};
`;

const CounterTotal = styled(CounterCurrent)`
  font-family: ${(props) => props.theme.fontFamily.text};
`;

const Notes = styled(RawText)`
  font-size: ${dp(14)}px;
  margin-top: ${dp(8)}px;
  margin-bottom: ${dp(16)}px;
  color: ${(props) => props.theme.color.notes};
`;

const Button = styled(BaseButton)`
  margin-top: ${dp(25)}px;
  margin-bottom: ${dp(13)}px;
`;

/** A form that shows boolean questions to answer */
const Questionary: React.VoidFunctionComponent<QuestionaryProps> = (props) => {
  const [index, setIndex] = useState(0);
  const [haveOther, setHaveOther] = useState(false);
  const [other, setOther] = useState<Array<string>>(
    new Array(props.questions.length).fill("")
  );
  const [answers, setAnswers] = useState<Array<number | undefined>>(
    new Array(props.questions.length).fill(undefined)
  );

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

      let next = index + 1;

      // Exceção pra única atividade que tem perguntas opcionais.
      if (option == 0 && props.id == "65299dfebb17c70be4dfd3f1" && (index == 2 || index == 4)) {
        newAnswers[index+1] = option;
        setAnswers(newAnswers)
        next = index + 2;
      }

      if (next < answers.length) setTimeout(() => setIndex(next), 500);
    } else {
      setHaveOther(true);
    }
  };

  useEffect(() => {
    if (other[index] != "" || answers[index] == 2) {
      setHaveOther(true);
    } else {
      setHaveOther(false);
    }
  }, [index]);

  useEffect(() => {
    const lastAnswer = answers[answers.length - 1];
    if (lastAnswer != undefined && lastAnswer != 2)
      props.onFinish(
        answers.map((el, i) => {
          return el == 2 ? other[i] : el == 0;
        })
      );
  }, [answers]);

  /** Moves to the previous activity node */
  const handleBackPressed = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  function handleInputChange(text: string) {
    const newOther = [...other];
    newOther[index] = text;
    return setOther(newOther);
  }

  function handleNext() {
    if (answers[answers.length - 1] == 2) {
      props.onFinish(
        answers.map((el, i) => {
          return el == 2 ? other[i] : el == 0;
        })
      );
    } else {
      const next = index + 1;
      
      if (next < answers.length) setTimeout(() => setIndex(next), 500);
    }
  }

  return currentNode ? (
    <>
      <Counter>
        <CounterCurrent>{`Pergunta ${index + 1}`}</CounterCurrent>
        <CounterTotal> / {answers.length}</CounterTotal>
      </Counter>
      <Md>{`# ${currentNode.question}`}</Md>
      {currentNode.notes && <Notes>{currentNode.notes}</Notes>}
      <RadioQuestions
        questions={["Sim", "Não", "Outros"]}
        onSelected={handleRadioSelect}
        selected={answers[index]}
        style={{
          marginTop: currentNode.notes ? 0 : dp(24),
          paddingBottom: dp(10)
        }}
      />

      {haveOther ? (
        <AreaInput
          labelProps={{ style: { fontWeight: "bold", marginLeft: 0, paddingLeft: 0 } }}
          label="Descreva abaixo quais outros comportamentos a criança demonstrou:"
          value={other[index]}
          onChangeText={handleInputChange}
        />
      ) : (
        <></>
      )}

      {haveOther ? (
        <Button label={"Próxima Pergunta"} onPress={handleNext} />
      ) : (
        <></>
      )}

      {
        index != 0 && <BackButton label={"Voltar"} backButton={true} onPress={handleBackPressed} />
      }
    </>
  ) : (
    <></>
  );
};

export default Questionary;
