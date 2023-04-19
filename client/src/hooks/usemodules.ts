import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules } from '../store/modules';

/** Gets the user modules */
const useModules = () => {
  const dispatch = useAppDispatch();
  const grade = useAppSelector((state) => state.progress.grade);
  const modules = useAppSelector((state) => state.modules.data);

  useEffect(() => {
    dispatch(fetchModules());
  }, [grade]);

  return modules;
}

export default useModules;
