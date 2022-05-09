import React, { useEffect } from "react";
import { FullView } from "../component/atom/full-view";
import List from "../component/molecule/list";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchLevels } from "../store/game-data";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";

interface LevelsProps {}

const Levels: React.VoidFunctionComponent<LevelsProps> = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const levels = useAppSelector((state) => state.gameData.levels);

  useEffect(() => {
    if (!levels.loaded) dispatch(fetchLevels());
  }, []);

  const handleItemPress = (id: string) => {
    navigation.navigate("Categories", { level: id });
  };

  return (
    <FullView>
      <List
        data={levels.data.map((el) => ({
          id: el._id,
          title: el.name,
          subtitle: el.name,
        }))}
        onItemPress={handleItemPress}
      ></List>
    </FullView>
  );
};

export default Levels;
