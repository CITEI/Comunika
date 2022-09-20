import useUserModule from './useusermodule';
import useStages from './usestages';

/** Gets the current user module stages */
const useUserStages = () => {
  const module = useUserModule();
  const stages = useStages(module?._id);
  if (stages) return stages
  else return [];
}

export default useUserStages