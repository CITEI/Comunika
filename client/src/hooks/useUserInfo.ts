import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchUserData } from '../store/user';

const useUserInfo = () => {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((state) => state.user.loaded);
  const userData = useAppSelector((state) => state.user.info);

  useEffect(() => {
    if (!loaded) dispatch(fetchUserData());
  }, [loaded]);

  return userData;
}

export default useUserInfo;
