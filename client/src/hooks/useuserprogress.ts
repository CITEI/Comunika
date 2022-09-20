import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchBox } from '../store/user';

/** Gets the user box, module id and stage id */
const useUserProgress = () => {
  const loaded = useAppSelector((state) => state.user.boxLoaded);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loaded) dispatch(fetchBox());
  }, [loaded]);

  const box = useAppSelector((state) => state.user.box);
  const stage = useAppSelector((state) => state.user.progress.stage);
  const module = useAppSelector((state) => state.user.progress.module);

  if (box && stage && module)
    return { box, stage, module };
  else
    return undefined;
}

export default useUserProgress