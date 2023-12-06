import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { evaluate } from "../store/progress";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Activity from "../component/templates/activity";
import { useRoute } from "@react-navigation/native";
import useBox from "../hooks/useBox";
import { GameProps } from "../route/game";

/** Main game screen */
const Game: React.VoidFunctionComponent = () => {
  const route = useRoute();
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();

  const { module } = route.params as GameProps["Game"];
  const box = useBox(module.id);
  const [answers, setAnswers] = useState<(string | boolean)[][]>([]);

  /** Saves answers for sending */
  const handleFinish = useCallback((answers: (string | boolean)[][]) => {
    setAnswers(answers);
  }, []);

  /** Sends answers to the api */
  useEffect(() => {
    if (answers.length > 0)
      dispatch(evaluate({ module: module.id, answers: answers }));
  }, [answers]);

  /** Navigates to the next screen after sending answers */
  useEffect(() => {
    if (answers.length > 0) navigation.replace("Result", { module: module });
  }, [answers]);

  return box && module ? (
    <Activity
      activities={box.activities}
      onFinish={handleFinish}
      module={module.name}
      box={box}
    />
  ) : (
    <></>
  );
};

export default Game;
