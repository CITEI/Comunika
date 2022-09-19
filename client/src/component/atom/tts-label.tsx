import React from "react";
import { TextProps } from "react-native";
import { dp } from "../../helper/resolution";
import t from "../../pre-start/i18n";
import styled from "../../pre-start/themes";
import Text from "./text";

const Label = styled(Text)`
  text-align: center;
  margin-bottom: ${dp(10)}px;
`;

const TTSLabel: React.VoidFunctionComponent<TextProps> = (props) => {
  return <Label>{t("Tap here to listen instructions by audio")}</Label>;
};

export default TTSLabel;
