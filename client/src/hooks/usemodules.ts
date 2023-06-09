import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules } from '../store/modules';

/** Gets the user modules */
const useModules = () => {
  const dispatch = useAppDispatch();  
  const loaded = useAppSelector((state) => state.modules.loaded);
  const modules = useAppSelector((state) => state.modules.data);

  useEffect(() => {
    if(!loaded) dispatch(fetchModules());
  }, [loaded]);

  return modules;
}

export default useModules;
