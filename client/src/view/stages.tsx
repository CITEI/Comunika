import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";
import useUserStage from "../hooks/useuserstage";
import useUserStages from "../hooks/useuserstages";
import useBox from "../hooks/usebox";
import { StageItem } from "../store/game-data";
import useModules from "../hooks/useModules";

interface StagesProps {}

/** Screen that displays the list of stages */
function Stages () {
  const navigation = useNavigation<GameNavigatorProps>();
  const modules = useModules();

  /** Goes to the game screen */
  const handlePress = useCallback(
    (selection: StageItem) => {
      navigation.navigate("Transition", {
        stage: selection,
        activityIndex: 1,
      });
    },
    [modules]
  );

  return modules.length >= 0 ? (
    <Cards
      data={modules}
      onPress={handlePress}
    />
  ) : (
    <></>
  );
};

export default Stages;
