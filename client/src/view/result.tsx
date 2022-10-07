import React from "react";
import ResultTemplate from "../component/templates/result";
import useBox from "../hooks/usebox";
import useUserStage from "../hooks/useuserstage";
import { useAppSelector } from "../store/store";

/** Screen displayed after an activity box is completed */
const Result: React.VoidFunctionComponent = () => {
  const stage = useUserStage();
  const box = useBox();
  const lastStatus = useAppSelector(state => state.user.progress.evaluation);
  const status = box == undefined ? "ended" : lastStatus;

  return stage ? (
    <ResultTemplate stage={stage} status={status} />
  ) : (
    <></>
  );
};

export default Result;
