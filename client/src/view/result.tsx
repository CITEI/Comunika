import { Text } from "react-native";
import React from "react";
import { FullView } from "../component/atom/full-view";
import { useNavigation } from "@react-navigation/native";
import Button from "../component/atom/button";
import { GameNavigatorProps } from "../route/game";
import ResultTemplate from "../component/templates/result";
import { useAppSelector } from "../store/store";

const Result: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const stages = useAppSelector((state) => state.gameData.stages.data);

  const stage = stages.find((stage) => stage._id == stageId);

  const handlePress = () => {
    navigation.navigate("Main");
  };

  return stage ? <ResultTemplate stage={stage} /> : <></>;
};

export default Result;
