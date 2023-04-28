import RawText from '../atom/text';
import React from 'react'
import { TextProps } from 'react-native';
import styled from '../../pre-start/themes';
import { dp } from '../../helper/resolution';

const Container = styled(RawText)`
  text-align: center;
  padding: ${(props) => dp(22)}px;
  padding-bottom: 0;
`

const Link = styled(RawText)`
  color: ${(props) => props.theme.color.primary};
  font-weight: bold;
`

const ToS: React.VoidFunctionComponent = () => {
  return (
    <Container>
      <RawText>Ao se cadastrar, você concorda com os </RawText>
      <Link onPress={() => console.log()}>Termos de Serviço</Link>
      <RawText> e a </RawText>
      <Link onPress={() => console.log()}>Política de Privacidade</Link>
      <RawText>.</RawText>
    </Container>
  )
}

export default ToS;