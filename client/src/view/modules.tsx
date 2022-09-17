import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchStages, fetchModules, ModuleItem } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";

interface ModulesProps {}

/** Screen that displays a list of modules */
const Modules: React.VoidFunctionComponent<ModulesProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state) => state.gameData.modules);
  const stages = useAppSelector((state) => state.gameData.stages);
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const moduleId = useAppSelector((state) => state.user.progress.module);
  const moduleIndex = modules.data.findIndex(
    (module) => module._id == moduleId
  );
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);

  /** Fetches modules if not yet loaded */
  useEffect(() => {
    if (!modules.loaded) dispatch(fetchModules());
  }, []);

  /** Fetches the stages of the current module */
  useEffect(() => {
    if (moduleId) dispatch(fetchStages(moduleId));
  }, [modules.loaded, moduleId]);

  /** Calculates the number of completed stages */
  useEffect(() => {
    if (stageId == null) {
      setProgress(1);
      setTotal(1);
    } else if (stages && moduleId && moduleId in stages && modules) {
      setProgress(stages[moduleId].findIndex((el) => el._id == stageId));
      setTotal(stages[moduleId].length);
    }
  }, [stages]);

  /** Navigates to the stages screen og a given module */
  const handleItemPress = useCallback((module: ModuleItem) => {
    navigation.navigate("Stages", { moduleId: module._id });
  }, []);

  /** Skips this screen if only one module is present */
  useEffect(() => {
    if (modules.data.length == 1) handleItemPress(modules.data[0]);
  }, [modules, stageId, refresh]);

  navigation.addListener("focus", () => setRefresh(refresh + 1));

  return (
    <Cards
      title="Modules"
      onPress={handleItemPress}
      data={modules.data}
      current={moduleIndex}
      progress={progress}
      total={total}
    />
  );
};

export default Modules;
