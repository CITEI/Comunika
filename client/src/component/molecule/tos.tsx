import RawText from '../atom/text';
import React from 'react';
import { Linking } from 'react-native';
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
      <Link onPress={() => Linking.openURL("https://drive.google.com/file/d/1mF5b8NPe_Q440TNOy8p0o95Id7p4hxaq/view?usp=sharing")}>Termos de Uso</Link>
      <RawText> e a </RawText>
      <Link onPress={() => Linking.openURL("https://drive.google.com/file/d/1mF5b8NPe_Q440TNOy8p0o95Id7p4hxaq/view?usp=sharing")}>Política de Privacidade</Link>
      <RawText>.</RawText>
    </Container>
  )
}

export default ToS;