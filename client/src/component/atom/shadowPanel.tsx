import { View, Text, ViewProps } from "react-native";
import React from "react";
import { dp } from "../../helper/resolution";
import styled from "../../pre-start/themes";

export interface ShadowPanelProps extends ViewProps {
  elevation?: number;
}

const Panel = styled.View`
  background: ${(props) => props.theme.color.background};
  border-radius: ${dp(10)}px;
`;

const ShadowPanel: React.FunctionComponent<ShadowPanelProps> = (props) => {
  return (
    <Panel style={[{ elevation: props.elevation || 10 }, props.style]}>
      {props.children}
    </Panel>
  );
};

export default ShadowPanel;
