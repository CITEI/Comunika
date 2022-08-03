import { dp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import { ViewProps } from "react-native";
import React from "react";

interface ContentContainerProps extends ViewProps {}

const ScrollContainer = styled.ScrollView`
  height: 100%;
`;

/** Inline padded container */
const PaddedContainer = styled.View`
  padding-left: ${dp(20)}px;
  padding-right: ${dp(20)}px;
`;

const ContentContainer: React.FunctionComponent<ContentContainerProps> = (
  props
) => {
  return (
    <ScrollContainer>
      <PaddedContainer {...props}>{props.children}</PaddedContainer>
    </ScrollContainer>
  );
};

export default ContentContainer;
