import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { BoxItem, fetchBoxes } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import { showMessage } from "react-native-flash-message";
import Cards from "../component/templates/cards";

interface BoxesProps {}

const Boxes: React.VoidFunctionComponent<BoxesProps> = (props) => {
  const route = useRoute();
  const { stageId } = route.params as any;
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const boxes = useAppSelector((state) => state.gameData.boxes);
  const box = useAppSelector((state) => state.user.progress.box);

  useEffect(() => {
    if (!(stageId in boxes)) dispatch(fetchBoxes(stageId));
  }, []);

  const handleItemPress = (item: BoxItem) => {
    if (box == item._id)
      navigation.navigate("Transition", { box: item });
    else
      showMessage({
        message: "Not your current box",
        type: "info",
      });
  };

  return (
    <>
      {boxes[stageId] ? (
        <Cards
          title="Boxes"
          onPress={handleItemPress}
          data={boxes[stageId]}
          current={0}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Boxes;
