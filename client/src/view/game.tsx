import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { evaluate, fetchStage } from "../store/user";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Activity from "../component/templates/activity";

interface GameProps {}

const Game: React.VoidFunctionComponent<GameProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const box = useAppSelector((state) => state.user.box);
  const boxLoaded = useAppSelector((state) => state.user.boxLoaded);
  const evaluation = useAppSelector((state) => state.user.result);

  const moduleId = useAppSelector((state) => state.user.progress.module);
  const modules = useAppSelector((state) => state.gameData.modules.data);

  const module = modules.find((module) => module._id == moduleId);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!boxLoaded) dispatch(fetchStage());
  }, [boxLoaded]);

  /** Sends answers to evaluation */
  const handleFinish = useCallback((answers: boolean[][]) => {
    dispatch(evaluate(answers));
    setFinished(true);
  }, []);

  useEffect(() => {
    if (finished) navigation.navigate("Result");
  }, [evaluation, finished]);

  return boxLoaded ? (
    <Activity
      activities={box}
      onFinish={handleFinish}
      module={module?.name || "None"}
    ></Activity>
  ) : (
    <></>
  );
};

export default Game;
