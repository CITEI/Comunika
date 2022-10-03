import React from 'react'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import styled from '../../pre-start/themes'
import { sp } from '../../helper/resolution'

interface TextProps extends RNTextProps {}

const RawText = styled(RNText)`
  font-size: ${(props) => sp(12)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`

const Text: React.FunctionComponent<TextProps> = (props) => {
  return (
    <RawText {...props}>{props.children}</RawText>
  )
}

export default Text