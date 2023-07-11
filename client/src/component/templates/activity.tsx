import React, { useCallback, useEffect, useState } from "react";
import { Activity as ActivityType, AppBox } from "../../store/progress";
import MainContainer from "../atom/mainContainer";
import ContentContainer from "../atom/contentContainer";
import Toolbar from "../organism/toolbar";
import Instructions from "../organism/instructions";
import Questionary from "../organism/questionary";
import { addAnswers } from "../../store/local/GameStorage";
import { useAppSelector } from "../../store/store";

interface ActivityProps {
  box: AppBox;
  module: string;
  activities: ActivityType[];
  onFinish: (answers: (boolean | string)[][]) => void;
}

const Activity: React.VoidFunctionComponent<ActivityProps> = (props) => {
  const [activityIndex, setActivityIndex] = useState(props.box.answers.length);
  const [answering, setAnswering] = useState(false);
  const [answers, setAnswers] = useState<(string | boolean)[][]>(
    props.box.answers
  );
  const activityStreak = useAppSelector(
    (state) => state.progress.activityStreak
  );

  const activity = props.activities[activityIndex];

  /** Starts answering screens */
  const handleFinishedInstructions = useCallback(() => setAnswering(true), []);
  const handleFinishedQuestionary = useCallback(
    async (activityAnswers: (string | boolean)[]) => {
      if (activityIndex < props.activities.length)
        setAnswers([...answers, activityAnswers]);
      await addAnswers(props.box.module, activityAnswers);
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

  return activity ? (
    <MainContainer>
      <Toolbar
        accountButton={false}
        closeButton={true}
        logo={answering}
        shadow={false}
        popCount={2 + activityStreak}
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
  ) : (
    <></>
  );
};

export default Activity;
