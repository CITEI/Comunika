import React, { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";
import useModules from "../hooks/useModules";
import { Module } from '../store/modules';
import useBoxes from '../hooks/useBoxes';

/** Screen that displays a list of modules */
const Modules: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const modules = useModules();
  const boxes = useBoxes();

  /** Goes to the game screen */
  const handlePress = useCallback(
    (selection: Module) => {
      const box = boxes[selection.id] ?? undefined;
      navigation.navigate("Transition", {
        module: selection,
        activityIndex: box? box.answers.length + 1 : 1,
      });
    },
    [modules]
  );

  return modules ? (
    <Cards
      title={t("Modules")}
      unit={t("module")}
      onPress={handlePress}
      boxes={boxes}
      data={modules}
    />
  ) : <></>;
};

export default Modules;
