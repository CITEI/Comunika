import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import useModules from "../hooks/useModules";
import { Module } from "../store/modules";
import useAnswers from "../hooks/useAnswers";
import { disableBoxLoaded } from "../store/progress";
import { useAppDispatch } from "../store/store";

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
      navigation.navigate("Transition", {
        module: selection,
      });
    },
    [modules]
  );

  return modules ? (
    <Cards
      title={"Atividades"}
      unit={"módulo"}
      onPress={handlePress}
      answers={answers}
      data={modules}
    />
  ) : (
    <></>
  );
};

export default Modules;
