import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store';
import { readAnswers } from '../store/progress';

/** Gets the user boxes */
const useAnswers = () => {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((state) => state.progress.answers);
  const loaded = useAppSelector((state) => state.progress.flags.answers);

  useEffect(() => {
    dispatch(readAnswers());
  }, [loaded]);

  return answers;
}

export default useAnswers;
