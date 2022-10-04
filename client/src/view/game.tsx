import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { evaluate } from "../store/user";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Activity from "../component/templates/activity";
import useUserModule from "../hooks/useusermodule";
import useBox from "../hooks/usebox";

interface GameProps {}

/** Main game screen */
const Game: React.VoidFunctionComponent<GameProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const box = useBox();
  const module = useUserModule();
  const [answers, setAnswers] = useState<boolean[][]>([]);

  /** Saves answers for sending */
  const handleFinish = useCallback((answers: boolean[][]) => {
    setAnswers(answers);
  }, []);

  /** Sends answers to the api */
  useEffect(() => {
    if (answers.length > 0) dispatch(evaluate(answers));
  }, [answers]);

  /** Navigates to the next screen after sending answers */
  useEffect(() => {
    if (answers.length > 0) navigation.replace("Result");
  }, [box]);

  return box && module ? (
    <Activity
      activities={box}
      onFinish={handleFinish}
      module={module.name}
    />
  ) : (
    <></>
  );
};

export default Game;
