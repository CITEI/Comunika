import RawText from '../atom/text';
import React from 'react'
import { TextProps } from 'react-native';
import styled from '../../pre-start/themes';
import { dp } from '../../helper/resolution';

interface TextLinkProps extends TextProps {
  text: string;
  link: string;
  onPress: () => void;
}

const Container = styled(RawText)`
  text-align: center;
  padding: ${(props) => dp(22)}px;
`

const Link = styled(RawText)`
  color: ${(props) => props.theme.color.primary};
  font-weight: bold;
`

const TextLink: React.VoidFunctionComponent<TextLinkProps> = (props) => {
  return (
    <Container>
      <RawText>{props.text}</RawText>
      <Link onPress={props.onPress}>{props.link}</Link>
    </Container>
  )
}

export default TextLink