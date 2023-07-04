import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules, markModulesAsLoading } from '../store/modules';

/** Gets the user modules */
const useModules = () => {
  const dispatch = useAppDispatch();  
  const modules = useAppSelector((state) => state.modules.data);
  const loading = useAppSelector((state) => state.modules.loading);
  const answers = useAppSelector((state) => state.progress.answers);

  useEffect(() => {
    if(!loading) {
      dispatch(markModulesAsLoading());
      dispatch(fetchModules());
    }
  }, [answers]);

  return modules;
}

export default useModules;
