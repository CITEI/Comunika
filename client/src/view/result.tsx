import React from "react";
import ResultTemplate from "../component/templates/result";
import useBox from "../hooks/usebox";
import useUserStage from "../hooks/useuserstage";

/** Screen displayed after an activity box is completed */
const Result: React.VoidFunctionComponent = () => {
  const stage = useUserStage();
  const box = useBox();

  return stage ? (
    <ResultTemplate stage={stage} no_content={box == undefined} />
  ) : (
    <></>
  );
};

export default Result;
