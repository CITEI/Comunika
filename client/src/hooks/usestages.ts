import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchStages, StageItem } from '../store/game-data'

/** Gets all stages attached to a module */
const useStages = (moduleId?: string) => {
  const moduleStages = useAppSelector((state) => state.gameData.stages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (moduleId && !(moduleId in moduleStages)) dispatch(fetchStages(moduleId));
  }, [moduleStages, moduleId]);

  if (moduleId && moduleId in moduleStages) return moduleStages[moduleId];
  else return [];
}

export default useStages