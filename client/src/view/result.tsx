import { Text } from "react-native";
import React from "react";
import { FullView } from "../component/atom/full-view";
import { useNavigation } from "@react-navigation/native";
import Button from "../component/atom/button";
import { GameNavigatorProps } from "../route/game";

const Result: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();

  const handlePress = () => {
    navigation.navigate("Main");
  };

  return (
    <FullView>
      <Text style={{ fontWeight: "bold", flex: 1 }}>
        Congratulations, you've completed this box
      </Text>
      <Button title="Return" onPress={handlePress} />
    </FullView>
  );
};

export default Result;
