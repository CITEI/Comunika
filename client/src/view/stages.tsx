import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchBoxes, fetchStages, StageItem } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";

interface StagesProps {}

const Stages: React.VoidFunctionComponent<StagesProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const stages = useAppSelector((state) => state.gameData.stages);
  const boxes = useAppSelector((state) => state.gameData.boxes);
  const boxId = useAppSelector((state) => state.user.progress.box);
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const stageIndex = stages.data.findIndex((stage) => stage._id == stageId);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!stages.loaded) dispatch(fetchStages());
  }, []);

  useEffect(() => {
    if (stageId) dispatch(fetchBoxes(stageId));
  }, [stages.loaded, stageId]);

  useEffect(() => {
    if (boxId == null) {
      setProgress(1);
      setTotal(1);
    } else if (boxes && stageId && stageId in boxes && stages) {
      setProgress(boxes[stageId].findIndex((el) => el._id == boxId));
      setTotal(boxes[stageId].length);
    }
  }, [boxes]);

  const handleItemPress = (stage: StageItem) => {
    navigation.navigate("Boxes", { stageId: stage._id });
  };

  return (
    <Cards
      title="Stages"
      onPress={handleItemPress}
      data={stages.data}
      current={stageIndex}
      progress={progress}
      total={total}
    />
  );
};

export default Stages;
