import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchLevels, LevelItem } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import Cards from "../component/templates/cards";

interface LevelsProps {}

const Levels: React.VoidFunctionComponent<LevelsProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const levels = useAppSelector((state) => state.gameData.levels);

  useEffect(() => {
    if (!levels.loaded) dispatch(fetchLevels());
  }, []);

  const handleItemPress = (level: LevelItem) => {
    navigation.navigate("Categories", { levelId: level._id });
  };

  return (
    <Cards
      title="Levels"
      onPress={handleItemPress}
      data={levels.data}
      current={0}
    />
  );
};

export default Levels;
