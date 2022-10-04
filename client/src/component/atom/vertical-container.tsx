import React from "react";
import { View as RawView, ViewProps } from "react-native";
import styled from "styled-components/native";

const View = styled(RawView)`
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

export interface VerticalContainerProps extends ViewProps {}

const VerticalContainer: React.FunctionComponent<VerticalContainerProps> = (
  props
) => {
  return <View {...props}>{props.children}</View>;
};

export default VerticalContainer;
