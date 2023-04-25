import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { readAnswers } from '../store/progress';

/** Gets the user boxes */
const useAnswers = () => {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((state) => state.progress.answers);
  const loaded = useAppSelector((state) => state.progress.flags.answers);
  const box = useAppSelector((state) => state.progress.box);

  useEffect(() => {
    dispatch(readAnswers());
  }, [loaded, box]);

  return answers;
}

export default useAnswers;
