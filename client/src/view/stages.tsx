import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchStages, StageItem } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";

interface StagesProps {}

const Stages: React.VoidFunctionComponent<StagesProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const stages = useAppSelector((state) => state.gameData.stages);
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const stageIndex = stages.data.findIndex((stage) => stage._id == stageId);

  useEffect(() => {
    if (!stages.loaded) dispatch(fetchStages());
  }, []);

  const handleItemPress = (stage: StageItem) => {
    navigation.navigate("Boxes", { stageId: stage._id });
  };

  return (
    <Cards
      title="Stages"
      onPress={handleItemPress}
      data={stages.data}
      current={stageIndex}
    />
  );
};

export default Stages;
