import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type GameProps = {
  Main: undefined;
  Categories: {
    level: string;
  };
  Game: undefined;
  Result: undefined;
  Settings: undefined
};

export type GameNavigatorProps = NativeStackNavigationProp<GameProps>;
