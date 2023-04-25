import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules } from '../store/modules';

/** Gets the user modules */
const useModules = () => {
  const dispatch = useAppDispatch();  
  const box = useAppSelector((state) => state.modules.loaded);
  const modules = useAppSelector((state) => state.modules.data);

  useEffect(() => {
    dispatch(fetchModules());
  }, [box]);

  return modules;
}

export default useModules;
