import React from "react";
import ResultTemplate from "../component/templates/result";
import { useAppSelector } from "../store/store";

const Result: React.VoidFunctionComponent = () => {
  const stageId = useAppSelector((state) => state.user.progress.stage);
  const stages = useAppSelector((state) => state.gameData.stages.data);

  const stage = stages.find((stage) => stage._id == stageId);

  return stage ? <ResultTemplate stage={stage} /> : <></>;
};

export default Result;
