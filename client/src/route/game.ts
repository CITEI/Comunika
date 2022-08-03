import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StageItem } from "../store/game-data";

export type GameProps = {
  Main: undefined;
  Boxes: {
    stageId: string;
  };
  Transition: {
    stage: StageItem;
    boxIndex: number;
  }
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
