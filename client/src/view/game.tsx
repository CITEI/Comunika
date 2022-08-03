import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { evaluate, fetchBox } from "../store/user";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Activity from "../component/templates/activity";

interface GameProps {}

const Game: React.VoidFunctionComponent<GameProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const userbox = useAppSelector((state) => state.user.userbox);
  const userboxLoaded = useAppSelector((state) => state.user.userboxLoaded);
  const evaluation = useAppSelector((state) => state.user.result);

  const stageId = useAppSelector((state) => state.user.progress.stage);
  const stages = useAppSelector((state) => state.gameData.stages.data);

  const stage = stages.find((stage) => stage._id == stageId);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!userboxLoaded) dispatch(fetchBox());
  }, [userboxLoaded]);

  /** Sends answers to evaluation */
  const handleFinish = useCallback((answers: boolean[][]) => {
    dispatch(evaluate(answers));
    setFinished(true);
  }, []);

  useEffect(() => {
    if (finished) navigation.navigate("Result");
  }, [evaluation, finished]);

  return userboxLoaded ? (
    <Activity
      activities={userbox}
      onFinish={handleFinish}
      stage={stage?.name || "None"}
    ></Activity>
  ) : (
    <></>
  );
};

export default Game;
