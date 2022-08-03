import { View, Text } from 'react-native'
import React from 'react'
import { AudibleMosaicNode } from '../../store/user'

interface AudibleMosaicProps {
  images: AudibleMosaicNode['images']
}

const AudibleMosaic: React.VoidFunctionComponent<AudibleMosaicProps> = (props) => {
  return (
    <View>
      <Text>AudibleMosaic</Text>
    </View>
  )
}

export default AudibleMosaic