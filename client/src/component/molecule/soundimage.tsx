import { View, Text } from 'react-native'
import React from 'react'
import styled from '../../pre-start/themes'

export interface SoundImageProps {
  /** image uri */
  image: string;
  /** image alt description */
  imageAlt: string;
  /** audio uri */
  audio?: string;
}

const Container = styled.ImageBackground`
`

const SoundImage: React.VoidFunctionComponent<SoundImageProps> = (props) => {
  return (
    <Container source={{uri: props.image}} accessibilityHint={props.imageAlt} resizeMode='cover'>
      <Text>SoundImage</Text>
    </Container>
  )
}

export default SoundImage