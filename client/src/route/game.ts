import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BoxItem } from "../store/game-data";

export type GameProps = {
  Main: undefined;
  Boxes: {
    stageId: string;
  };
  Transition: {
    box: BoxItem;
  }
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
