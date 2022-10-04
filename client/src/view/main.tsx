import React from "react";
import useUserProgress from "../hooks/useuserprogress";
import useUserInfo from "../hooks/useuserinfo";
import Modules from "./modules";

interface MainProps {}

const Main: React.VoidFunctionComponent<MainProps> = () => {
  const info = useUserInfo();
  const progress = useUserProgress();

  return (progress && info ? <Modules></Modules> : <></>);
};

export default Main;
