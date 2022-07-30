import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CategoryItem } from "../store/game-data";

export type GameProps = {
  Main: undefined;
  Categories: {
    levelId: string;
  };
  Transition: {
    category: CategoryItem;
  }
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
