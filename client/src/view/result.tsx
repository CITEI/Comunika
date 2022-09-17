import React, { useEffect, useState } from "react";
import ResultTemplate from "../component/templates/result";
import { fetchStages, StageItem } from "../store/game-data";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUserData } from "../store/user";

/** Screen displayed after an activity box is completed */
const Result: React.VoidFunctionComponent = () => {
  const dispatch = useAppDispatch();
  const userReloaded = useAppSelector((state) => state.user.loaded);

  useEffect(() => {
    if (!userReloaded) dispatch(fetchUserData());
  }, [userReloaded]);

  const moduleStages = useAppSelector((state) => state.gameData.stages);
  const moduleId = useAppSelector((state) => state.user.progress.module);
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const [stage, setStage] = useState<undefined | StageItem>(undefined);

  useEffect(() => {
    if (userReloaded && moduleId && stageId)
      if (moduleId in moduleStages)
        setStage(moduleStages[moduleId].find((stage) => stage._id == stageId));
      else dispatch(fetchStages(moduleId));
  }, [moduleId, stageId, moduleStages, userReloaded]);

  return stage ? <ResultTemplate stage={stage} /> : <></>;
};

export default Result;
