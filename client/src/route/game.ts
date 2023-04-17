import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Module } from "../store/modules";

export type GameProps = {
  Main: undefined;
  Transition: {
    module: Module;
    activityIndex: number;
  }
  Game: {
    module: Module;
    activitiesDone?: number;
  };
  Result: {
    module: Module;
  };
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
