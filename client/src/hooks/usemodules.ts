import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchModules } from '../store/game-data';

/** Gets the app modules */
const useModules = () => {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((state) => state.gameData.modules.loaded);
  const modules = useAppSelector((state) => state.gameData.modules.data);

  useEffect(() => {
    if (!loaded) dispatch(fetchModules());
  }, [loaded]);

  return modules;
}

export default useModules
