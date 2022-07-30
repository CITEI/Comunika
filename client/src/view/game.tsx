import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { evaluate, fetchBox } from "../store/user";
import { useNavigation } from "@react-navigation/native";
import Node from "../component/organism/node";
import QuestionNode from "../component/organism/question-node";
import { showMessage } from "react-native-flash-message";
import { GameNavigatorProps } from "../route/game";
import Carrousel from "../component/molecule/carrousel";
import MainContainer from "../component/molecule/main-container";
import ContentContainer from "../component/atom/content-container";

interface GameProps {}

const Game: React.VoidFunctionComponent<GameProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const box = useAppSelector((state) => state.user.box);
  const boxLoaded = useAppSelector((state) => state.user.boxLoaded);

  const [taskIndex, setTaskIndex] = useState(0);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [answering, setAnswering] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[][]>([]);

  const handleNextPressed = () => {
    const nextNode = nodeIndex + 1;
    if (nextNode < box[taskIndex].nodes.length) setNodeIndex(nextNode);
    else {
      const nextTask = taskIndex + 1;
      if (nextTask < box.length) {
        setNodeIndex(0);
        setTaskIndex(nextTask);
      } else {
        setNodeIndex(0);
        setTaskIndex(0);
        setAnswering(true);
      }
    }
  };

  const handleAnswer = (answer: boolean) => {
    if (!finished) {
      if (nodeIndex == 0) answers.push([answer]);
      else answers[taskIndex].push(answer);

      const nextNode = nodeIndex + 1;
      if (nextNode < box[taskIndex].questionNodes.length)
        setNodeIndex(nextNode);
      else {
        const nextTask = taskIndex + 1;
        if (nextTask < box.length) {
          setNodeIndex(0);
          setTaskIndex(nextTask);
        } else {
          setFinished(true);
        }
      }

      setAnswers(answers.slice());
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (finished) dispatch(evaluate(answers));
  }, [finished]);

  useEffect(() => {
    if (finished) {
      showMessage({
        message: "Category Finished",
        type: "success",
        onHide: () => navigation.navigate("Result"),
      });
    } else if (!boxLoaded) dispatch(fetchBox());
  }, [boxLoaded]);

  return (
    <MainContainer>
      <ContentContainer>
        <Carrousel
          slides={[
            {
              image:
                'http://10.0.2.2:3000/public/level/282d7d3c-9b18-4c32-98f0-abbea1921c54.png',
              imageAlt: 'asd',
            },
            {
              audio: 'http://10.0.2.2:3000/public/task/f4de27b5-d00b-4096-84fa-88e4e5e81cba.ogg',
            },
            {
              image:
                'http://10.0.2.2:3000/public/level/282d7d3c-9b18-4c32-98f0-abbea1921c54.png',
              imageAlt: 'asd',
              audio: 'http://10.0.2.2:3000/public/task/f4de27b5-d00b-4096-84fa-88e4e5e81cba.ogg',
            },
          ]}
        />
        {boxLoaded &&
          (answering ? (
            <QuestionNode
              title={box[taskIndex].questionNodes[nodeIndex].title}
              question={box[taskIndex].questionNodes[nodeIndex].question}
              onAnswer={handleAnswer}
            />
          ) : (
            <Node
              type={box[taskIndex].nodes[nodeIndex].type}
              title={box[taskIndex].nodes[nodeIndex].title}
              text={box[taskIndex].nodes[nodeIndex].text || undefined}
              onNextPressed={handleNextPressed}
            ></Node>
          ))}
      </ContentContainer>
    </MainContainer>
  );
};

export default Game;
