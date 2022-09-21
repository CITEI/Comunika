import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";
import useUserStage from "../hooks/useuserstage";
import useUserStages from "../hooks/useuserstages";
import useBox from "../hooks/usebox";
import { StageItem } from "../store/game-data";

interface StagesProps {}

/** Screen that displays the list of stages */
const Stages: React.VoidFunctionComponent<StagesProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();
  const stages = useUserStages();
  const stage = useUserStage();
  const box = useBox();
  const index = stages.findIndex((el) => el._id == stage?._id);

  /** Goes to the game screen */
  const handlePress = useCallback(
    (selection: StageItem) => {
      navigation.navigate("Transition", {
        stage: selection,
        activityIndex: 1,
      });
    },
    [stages]
  );

  return stage && index >= 0 ? (
    <Cards
      current={index}
      unit={t("stage")}
      data={stages}
      onPress={handlePress}
      title={t("Stages")}
      progress={0}
      total={box ? box.length : 0}
    />
  ) : (
    <></>
  );
};

export default Stages;
