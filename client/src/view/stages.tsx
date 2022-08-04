import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchStages } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import MainContainer from "../component/atom/main-container";

interface StagesProps {}

/** Non visual screen to load stages */
const Stages: React.VoidFunctionComponent<StagesProps> = (props) => {
  const route = useRoute();
  const { moduleId } = route.params as any;
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state) => state.gameData.modules.data);
  const stages = useAppSelector((state) => state.gameData.stages);
  const stageId = useAppSelector((state) => state.user.progress.stage);

  useEffect(() => {
    if (!(moduleId in stages)) dispatch(fetchStages(moduleId));
  }, []);

  useEffect(() => {
    if (stages && moduleId in stages && modules) {
      const stageIndex = stages[moduleId].findIndex((el) => el._id == stageId);
      const module = modules.find((el) => el._id == moduleId);
      if (stageIndex > -1 && module)
        navigation.navigate("Transition", { stageIndex: stageIndex + 1, module });
    }
  }, [stages, modules]);

  return <MainContainer></MainContainer>;
};

export default Stages;
