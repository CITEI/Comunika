import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUserData } from "../store/user";
import Levels from "./levels";

interface MainProps {}

const Main: React.VoidFunctionComponent<MainProps> = () => {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((state) => state.user.loaded);

  useEffect(() => {
    if (!loaded) dispatch(fetchUserData());
  }, [loaded]);

  return <Levels></Levels>;
};

export default Main;
