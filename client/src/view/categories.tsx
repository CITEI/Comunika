import React, { useEffect } from "react";
import { FullView } from "../component/atom/full-view";
import List from "../component/molecule/list";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchCategories } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import { showMessage } from "react-native-flash-message";

interface CategoriesProps {}

const Categories: React.VoidFunctionComponent<CategoriesProps> = (props) => {
  const route = useRoute();
  const { level } = route.params as any;
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.gameData.categories);
  const category = useAppSelector((state) => state.user.progress.category);

  useEffect(() => {
    if (!(level in categories)) dispatch(fetchCategories(level));
  }, []);

  const handleItemPress = (id: string) => {
    if (category == id)
      navigation.navigate("Game");
    else
      showMessage({
        message: "Not your current category",
        type: "info"
      })
  };

  return (
    <FullView>
      <List
        data={(categories[level] || []).map((el) => ({
          id: el._id,
          title: el.name,
          subtitle: el.name,
        }))}
        onItemPress={handleItemPress}
      ></List>
    </FullView>
  );
};

export default Categories;
