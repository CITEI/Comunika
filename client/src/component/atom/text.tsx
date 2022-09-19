import React from 'react'
import { TextStyle } from 'react-native'
import styled from '../../pre-start/themes'
import { sp } from '../../helper/resolution'

interface TextProps {
  style?: TextStyle[] | TextStyle
}

const StyledText = styled.Text`
  font-size: ${(props) => sp(12)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`

const Text: React.FunctionComponent<TextProps> = (props) => {
  return (
    <StyledText {...props}>{props.children}</StyledText>
  )
}

export default Text