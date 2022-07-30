import Icon from 'react-native-vector-icons/Feather'
import { IconProps } from 'react-native-vector-icons/Icon'
import React from 'react'
import { dp } from '../../helper/resolution'

const ToolbarButton: React.VoidFunctionComponent<IconProps> = (props) => {
  return (
    <Icon size={dp(20)} {...props}></Icon>
  )
}

export default ToolbarButton