import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchBoxes } from '../store/progress';

/** Gets the user boxes */
const useBoxes = () => {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((state) => state.progress.flags.box);
  const boxes = useAppSelector((state) => state.progress.box);

  useEffect(() => {
    if (!loaded) dispatch(fetchBoxes());
  }, [loaded]);

  return boxes;
}

export default useBoxes;
