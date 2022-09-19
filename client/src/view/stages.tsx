import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchStages } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";

interface StagesProps {}

/** Screen that displays the list of stages */
const Stages: React.VoidFunctionComponent<StagesProps> = (props) => {
  const route = useRoute();
  const { moduleId } = route.params as any;

  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();

  const moduleStages = useAppSelector((state) => state.gameData.stages);
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = moduleStages[moduleId] || [];

  /** Fetches a module stages if not present */
  useEffect(() => {
    if (!(moduleId in moduleStages)) dispatch(fetchStages(moduleId));
    else setStageIndex(stages.findIndex((stage) => stage._id == stageId));
  }, [moduleStages]);

  /** Goes to the game screen */
  const handlePress = useCallback(
    (stageId: string) => {
      navigation.navigate("Transition", {
        stage: stages[stageIndex],
        activityIndex: 1,
      });
    },
    [stageIndex, moduleStages]
  );

  return (
    <Cards
      current={stageIndex}
      data={stages}
      onPress={handlePress}
      title={t("Stages")}
      progress={0}
      total={1}
    />
  );
};

export default Stages;
