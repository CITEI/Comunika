import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules } from '../store/modules';

/** Gets the user modules */
const useModules = (reload?: boolean) => {
  const dispatch = useAppDispatch();
  const result = useAppSelector((state) => state.user.result);
  const modules = useAppSelector((state) => state.modules.data);

  useEffect(() => {
    dispatch(fetchModules());
  }, [result]);

  return modules;
}

export default useModules;
