import styled from 'styled-components/native'
import React from 'react'
import { dp } from '../../helper/resolution'
import { TextProps } from 'react-native'

interface TitleProps extends TextProps {}

const StyledText = styled.Text`
  font-size: ${(props) => dp(18)}px;
  font-family: ${(props) => props.theme.fontFamily.title};
  text-align: ${(props: TitleProps) => props.align || 'left'};
`

const Title: React.FunctionComponent<TitleProps> = (props) => {
  return (
    <StyledText {...props}>{props.children}</StyledText>
  )
}

export default Title
