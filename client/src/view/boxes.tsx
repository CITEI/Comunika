import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchBoxes } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import MainContainer from "../component/atom/main-container";

interface BoxesProps {}

/** Non visual screen to load boxes */
const Boxes: React.VoidFunctionComponent<BoxesProps> = (props) => {
  const route = useRoute();
  const { stageId } = route.params as any;
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const stages = useAppSelector((state) => state.gameData.stages.data);
  const boxes = useAppSelector((state) => state.gameData.boxes);
  const boxId = useAppSelector((state) => state.user.progress.box);

  useEffect(() => {
    if (!(stageId in boxes)) dispatch(fetchBoxes(stageId));
  }, []);

  useEffect(() => {
    if (boxes && stageId in boxes && stages) {
      const boxIndex = boxes[stageId].findIndex((el) => el._id == boxId);
      const stage = stages.find((el) => el._id == stageId);
      if (boxIndex > -1 && stage)
        navigation.navigate("Transition", { boxIndex: boxIndex + 1, stage });
    }
  }, [boxes, stages]);

  return <MainContainer></MainContainer>;
};

export default Boxes;
