import React, { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";
import useModules from "../hooks/useModules";
import { Module } from '../store/modules';
import useAnswers from '../hooks/useAnswers';
import { disableBoxLoaded } from '../store/progress';
import { useAppDispatch } from '../store/store';

/** Screen that displays a list of modules */
const Modules: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const modules = useModules();
  const answers = useAnswers();
  const dispatch = useAppDispatch();

  /** Goes to the game screen */
  const handlePress = useCallback(
    (selection: Module) => {
      dispatch(disableBoxLoaded());
      const box = answers[selection.id];
      navigation.navigate("Transition", {
        module: selection,
        localData: box ?? undefined,
      });
    },
    [modules]
  );

  return modules ? (
    <Cards
      title={t("Modules")}
      unit={t("module")}
      onPress={handlePress}
      answers={answers}
      data={modules}
    />
  ) : <></>;
};

export default Modules;
