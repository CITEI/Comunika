import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ModuleItem } from "../store/game-data";

export type GameProps = {
  Main: undefined;
  Stages: {
    moduleId: string;
  };
  Transition: {
    module: ModuleItem;
    stageIndex: number;
  }
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
