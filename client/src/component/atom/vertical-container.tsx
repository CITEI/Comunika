import React from "react";
import { ViewStyle } from "react-native";
import styled from "styled-components/native";

const View = styled.View`
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

interface VerticalContainerProps {
  style?: ViewStyle
}

const VerticalContainer: React.FunctionComponent<VerticalContainerProps> = (
  props
) => {
  return <View style={props.style}>{props.children}</View>;
};

export default VerticalContainer;
