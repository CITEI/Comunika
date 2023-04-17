import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { readStorage } from '../store/localStorage';

/** Gets the user boxes */
const useBoxes = () => {
  const dispatch = useAppDispatch();
  const boxes = useAppSelector((state) => state.storage.box);
  const result = useAppSelector((state) => state.user.result);

  useEffect(() => {
    dispatch(readStorage());
  }, [result]);

  return boxes;
}

export default useBoxes;
