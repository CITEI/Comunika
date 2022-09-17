import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ModuleItem, StageItem } from "../store/game-data";

export type GameProps = {
  Main: undefined;
  Stages: {
    moduleId: string;
  };
  Transition: {
    stage: StageItem;
    activityIndex: number;
  }
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
