import React from "react";
import { dp, sp } from "../../helper/resolution";
import styled from "../../pre-start/themes";
import Title from "../atom/title";
import logo from "../../../assets/logo.png";
import RawText from "../atom/text";
import { Image } from "expo-image";

const Header = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${dp(25)}px;
  margin-bottom: ${dp(30)}px;
`;

const Logo = styled(Image)`
  width: ${dp(200)}px;
  height: ${dp(40)}px;
  margin-bottom: ${dp(39)}px;
  margin-top: ${dp(25)}px;
`;

const Text = styled(RawText)`
  font-family: ${(props) => props.theme.fontFamily.textSemiBold};
  font-size: ${sp(15)}px;
  text-align: center;
  margin-top: ${dp(8)}px;
`

function ForgotHeader(props: {text: string}) {
  return (
    <Header>
      <Logo source={logo} contentFit="contain" />
      <Title>Recuperar Senha</Title>
      <Text>{props.text}</Text>
    </Header>
  );
};

export default ForgotHeader;