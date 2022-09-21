import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchStages, fetchModules, ModuleItem } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";
import t from "../pre-start/i18n";
import useModules from "../hooks/usemodules";
import useUserModule from "../hooks/useusermodule";

interface ModulesProps {}

/** Screen that displays a list of modules */
const Modules: React.VoidFunctionComponent<ModulesProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const modules = useModules();
  const module = useUserModule();
  const index = modules.findIndex((el) => el._id == module?._id);

  /** Navigates to the stages screen og a given module */
  const handleItemPress = useCallback((module: ModuleItem) => {
    navigation.navigate("Stages", { moduleId: module._id });
  }, [modules]);

  /** Skips this screen if it contains only one module */
  const skip = useCallback(() => {
    if (modules.length == 1)
      handleItemPress(modules[0])
  }, [modules])

  useEffect(() => {
    navigation.addListener("focus", skip);
    skip();
  }, [modules])

  return (modules.length > 1 && module) ? (
    <Cards
      title={t("Modules")}
      unit={t("module")}
      onPress={handleItemPress}
      data={modules}
      current={index}
      progress={0}
      total={1}
    />
  ) : <></>;
};

export default Modules;
