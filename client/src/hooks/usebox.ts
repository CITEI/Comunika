import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchBox } from '../store/progress';

/** Gets the user box by the module id */
const useBox = (module: string) => {
  const dispatch = useAppDispatch();
  const box = useAppSelector((state) => state.progress.box);
  const loaded = useAppSelector((state) => state.progress.flags.box);

  useEffect(() => {
    if (!loaded) dispatch(fetchBox(module));
  }, [loaded]);

  return box;
}

export default useBox;