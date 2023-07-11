import React from "react";
import useUserInfo from "../hooks/useUserInfo";
import useModules from "../hooks/useModules";
import Modules from "./modules";

interface MainProps {}

const Main: React.VoidFunctionComponent<MainProps> = () => {
  const userInfo = useUserInfo();
  const modules = useModules();

  return userInfo && modules.length > 0 ? <Modules /> : <></>;
};

export default Main;
