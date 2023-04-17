import React, { useCallback, useEffect, useState } from "react";
import { Activity as ActivityType} from "../../store/progress";
import MainContainer from "../atom/main-container";
import ContentContainer from "../atom/content-container";
import Toolbar from "../organism/toolbar";
import Instructions from "../organism/instructions";
import Questionary from "../organism/questionary";
import { addAnswers } from "../../store/local/GameStorage";

interface ActivityProps {
  boxID: string;
  module: string;
  activities: ActivityType[];
  done: number;
  onFinish: (answers: boolean[][]) => void;
}

const Activity: React.VoidFunctionComponent<ActivityProps> = (props) => {
  const [activityIndex, setActivityIndex] = useState(0 + props.done);
  const [answering, setAnswering] = useState(false);
  const [answers, setAnswers] = useState<boolean[][]>([]);

  const activity = props.activities[activityIndex];

  /** Starts answering screens */
  const handleFinishedInstructions = useCallback(() => setAnswering(true), []);
  const handleFinishedQuestionary = useCallback(
    async (activityAnswers: boolean[]) => {
      if (activityIndex < props.activities.length)
        setAnswers([...answers, activityAnswers]);
        await addAnswers(props.boxID, activityAnswers);

      const next = activityIndex + 1;
      if (next < props.activities.length) {
        setTimeout(() => {
          setActivityIndex(next);
          setAnswering(false);
        }, 500);
      }
    },
    [activityIndex, answers]
  );

  useEffect(() => {
    if (answers.length == props.activities.length) {
      props.onFinish(answers);
    }
  }, [answers, props.activities]);

  return (
    activity ? (
      <MainContainer>
        <Toolbar
          accountButton={false}
          closeButton={true}
          logo={answering}
          shadow={false}
          popCount={3}
        />
        <ContentContainer>
          {answering ? (
            <Questionary
              questions={activity.questionNodes}
              onFinish={handleFinishedQuestionary}
            />
          ) : (
            <Instructions
              activity={activityIndex + 1}
              nodes={activity.nodes}
              module={props.module}
              title={activity.name}
              onFinish={handleFinishedInstructions}
            />
          )}
        </ContentContainer>
      </MainContainer>
    )
  : <></>);
};

export default Activity;
