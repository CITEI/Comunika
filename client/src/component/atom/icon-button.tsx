import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import RawIcon from "react-native-vector-icons/AntDesign";
import React from 'react';
import styled from "../../pre-start/themes";
import { dp, sp } from "../../helper/resolution";

export interface IconButtonProps extends TouchableOpacityProps {
  icon: string;
}

const Container = styled(TouchableOpacity)`
  background: ${(props) => props.theme.color.primary};
  border-radius: ${dp(5)}px;
  padding: ${dp(5)}px;
  padding-left: ${dp(7)}px;
  padding-right: ${dp(7)}px;
  align-items: center;
  justify-content: center;
`;

const Icon = styled(RawIcon)`
  color: ${(props) => props.theme.color.text};
  font-size: ${sp(12)}px;
`;

const IconButton: React.VoidFunctionComponent<IconButtonProps> = (props) => {
  const { icon, ...rest } = props;
  return (
    <Container {...rest}>
      <Icon name={icon} />
    </Container>
  )
}

export default IconButton
