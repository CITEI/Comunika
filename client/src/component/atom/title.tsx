import styled from "../../pre-start/themes";
import React from "react";
import { dp } from "../../helper/resolution";
import { TextProps, Text } from "react-native";

interface TitleProps extends TextProps {}

const StyledTitle = styled(Text)`
  font-size: ${dp(18)}px;
  font-family: ${(props) => props.theme.fontFamily.title};
`;

const Title: React.FunctionComponent<TitleProps> = (props) => {
  return <StyledTitle {...props}>{props.children}</StyledTitle>;
};

export default Title;
