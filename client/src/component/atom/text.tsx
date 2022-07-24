import React from 'react'
import { TextStyle } from 'react-native'
import styled from 'styled-components/native'
import { sp } from '../../helper/resolution'

interface TextProps {
  style?: TextStyle
}

const StyledText = styled.Text`
  font-size: ${(props) => sp(14)}px;
  font-family: ${(props) => props.theme.fontFamily.text};
`

const Text: React.FunctionComponent<TextProps> = (props) => {
  return (
    <StyledText {...props}>{props.children}</StyledText>
  )
}

export default Text