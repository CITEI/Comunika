import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { CategoryItem, fetchCategories } from "../store/game-data";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import { showMessage } from "react-native-flash-message";
import Cards from "../component/templates/cards";

interface CategoriesProps {}

const Categories: React.VoidFunctionComponent<CategoriesProps> = (props) => {
  const route = useRoute();
  const { levelId } = route.params as any;
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.gameData.categories);
  const category = useAppSelector((state) => state.user.progress.category);

  useEffect(() => {
    if (!(levelId in categories)) dispatch(fetchCategories(levelId));
  }, []);

  const handleItemPress = (item: CategoryItem) => {
    if (category == item._id)
      navigation.navigate("Transition", { category: item });
    else
      showMessage({
        message: "Not your current category",
        type: "info",
      });
  };

  return (
    <>
      {categories[levelId] ? (
        <Cards
          title="Categories"
          onPress={handleItemPress}
          data={categories[levelId]}
          current={0}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Categories;
