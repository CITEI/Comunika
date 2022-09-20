import useModule from './usemodule';
import useUserProgress from './useuserprogress';

/** Gets the current user module */
const useUserModule = () => {
  const userData = useUserProgress();
  const module = useModule(userData?.module);
  return module;
}

export default useUserModule