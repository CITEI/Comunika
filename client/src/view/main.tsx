import React from "react";
import useUserInfo from "../hooks/useUserInfo";
import useModules from "../hooks/useModules";
import Modules from "./Modules";

interface MainProps {}

const Main: React.VoidFunctionComponent<MainProps> = () => {
  const userInfo = useUserInfo();
  const modules = useModules();

  return (userInfo && modules ? <Modules /> : <></>);
};

export default Main;
