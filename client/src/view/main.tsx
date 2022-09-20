import React from "react";
import useUserProgress from "../hooks/useuserprogress";
import Modules from "./modules";

interface MainProps {}

const Main: React.VoidFunctionComponent<MainProps> = () => {
  const progress = useUserProgress();

  return (progress ? <Modules></Modules> : <></>);
};

export default Main;
