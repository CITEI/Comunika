import React from "react";
import { TextProps } from "react-native";
import { dp, sp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import RawText from "./text";

const Label = styled(RawText)`
  font-family: ${(props) => props.theme.fontFamily.text};
  font-size: ${sp(10)}px;
  text-align: center;
  margin-bottom: ${dp(10)}px;
  font-family: ${(props) => props.theme.fontFamily.textSemiBold};
`;

function TTSLabel (props: TextProps) {
  return <Label>{"Clique para ouvir instruções por áudio:"}</Label>;
};

export default TTSLabel;
