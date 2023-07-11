import React from 'react'
import { dp } from '../../helper/resolution'
import styled from '../../pre-start/themes'
import Title from '../atom/title'
import logo from "../../../assets/logo.png";
import t from '../../pre-start/i18n';

const Header = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${dp(25)}px;
  margin-bottom: ${dp(31)}px;
`

const Logo = styled.Image`
  width: ${dp(185)}px;
  height: ${dp(40)}px;
  margin-bottom: ${dp(30)}px;
  margin-top: ${dp(25)}px;
`

const LoginHeader: React.VoidFunctionComponent = () => {
  return (
    <Header>
      <Logo source={logo} resizeMode="contain" />
      <Title>{"Boas vindas!"}</Title>
    </Header>
  )
}

export default LoginHeader