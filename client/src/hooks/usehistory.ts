import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchHistory } from '../store/user'

const useHistory = () => {
  const loaded = useAppSelector((state) => state.user.flags.history);
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state.user.history);

  useEffect(() => {
    if (!loaded) dispatch(fetchHistory());
  }, [loaded]);

  return history;
}

export default useHistory;
