import useStages from './usestages'

/** Gets a specific stage for a module */
const useStage = (moduleId?: string, stageId?: string) => {
  const stages = useStages(moduleId);
  if (stageId){
    const stage = stages.find((stage) => stage._id == stageId);
    return stage
  } else return undefined
}

export default useStage