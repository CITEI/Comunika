import React from "react";
import { TextProps } from "react-native";
import { dp } from "../../helper/resolution";
import t from "../../pre-start/i18n";
import styled from "../../pre-start/themes";
import RawText from "./text";

const Label = styled(RawText)`
  text-align: center;
  margin-bottom: ${dp(10)}px;
  font-family: ${(props) => props.theme.fontFamily.textSemiBold};
`;

const TTSLabel: React.VoidFunctionComponent<TextProps> = (props) => {
  return <Label>{t("Tap here to listen instructions by audio")}</Label>;
};

export default TTSLabel;
