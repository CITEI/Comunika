import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box } from '../store/local/GameStorage';
import { Module } from "../store/modules";

export type GameProps = {
  Main: undefined;
  Transition: {
    module: Module;
  }
  Game: {
    module: Module;
  };
  Result: {
    module: Module;
  };
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
