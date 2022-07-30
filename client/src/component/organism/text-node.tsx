import React from 'react'
import { View, Text } from 'react-native'
import { NodeProps } from './node'

interface TextNodeProps extends NodeProps {
  image: string;
  imageAlt: string;
}

const TextNode: React.VoidFunctionComponent<TextNodeProps> = (props) => {
  return (
    <View>
      <Image source={{uri: props.image}} />
      <Text>{props.text}</Text>
    </View>
  )
}

export default TextNode

