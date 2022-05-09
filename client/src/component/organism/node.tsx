import { Text, View } from "react-native";
import React from "react";
import { FullView } from "../atom/full-view";
import Button from "../atom/button";

export interface NodeProps {
  type: string;
  title: string;
  text?: string;
  onNextPressed: () => void;
}

const Node: React.FunctionComponent<NodeProps> = (props) => {
  const getInsides = () => {
    switch (props.type) {
      case "text":
        return <Text>{props.text}</Text>;
    }
  };

  return (
    <FullView>
      <Text style={{fontWeight: 'bold'}}>{props.title}</Text>
      <View style={{ flex: 1 }}>{getInsides()}</View>
      <Button title="Next" onPress={props.onNextPressed}></Button>
    </FullView>
  );
};

export default Node;
