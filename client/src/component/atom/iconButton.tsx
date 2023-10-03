import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import RawIcon from "@expo/vector-icons/AntDesign";
import React, { useMemo } from "react";
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
  color: ${(props) => props.theme.color.text};
`;

interface IconStyle {
  color?: string;
  fontSize?: number;
}

const Icon = styled(RawIcon)<IconStyle>`
  font-size: ${(props) => props.fontSize || sp(12)}px;
  color: ${(props) => props.color || props.theme.color.text};
`;

const IconButton: React.VoidFunctionComponent<IconButtonProps> = (props) => {
  const { icon, ...rest } = props;
  const style = useMemo(
    () => (StyleSheet.flatten(props.style) || {}) as ViewStyle & IconStyle,
    [props.style]
  );

  return (
    <Container {...rest}>
      <Icon name={icon} color={style.color} fontSize={style.fontSize} />
    </Container>
  );
};

export default IconButton;
