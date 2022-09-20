import useStage from "./usestage";
import useUserProgress from "./useuserprogress";

/** Gets the current user stage */
const useUserStage = () => {
  const userData = useUserProgress();
  const stage = useStage(userData?.module, userData?.stage);
  return stage
}

export default useUserStage