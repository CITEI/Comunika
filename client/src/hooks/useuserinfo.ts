import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchUserData } from '../store/user'

const useUserInfo = () => {
  const loaded = useAppSelector((state) => state.user.flags.info);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.info);

  useEffect(() => {
    if (!loaded) dispatch(fetchUserData());
  }, [loaded]);

  return userData.email ? userData : undefined;
}

export default useUserInfo;
