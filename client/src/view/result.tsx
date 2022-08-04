import React from "react";
import ResultTemplate from "../component/templates/result";
import { useAppSelector } from "../store/store";

const Result: React.VoidFunctionComponent = () => {
  const moduleId = useAppSelector((state) => state.user.progress.module);
  const modules = useAppSelector((state) => state.gameData.modules.data);

  const module = modules.find((module) => module._id == moduleId);

  return module ? <ResultTemplate module={module} /> : <></>;
};

export default Result;
