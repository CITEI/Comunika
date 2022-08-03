import React from "react";
import { TextProps } from "react-native";
import { dp, sp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import Text from "./text";

const Label = styled(Text)`
  text-align: center;
  margin-bottom: ${dp(10)}px;
`;

const TTSLabel: React.FunctionComponent<TextProps> = (props) => {
  return <Label>Tap here to listen instructions by audio:</Label>;
};

export default TTSLabel;
