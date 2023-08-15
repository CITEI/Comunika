import { Image } from "react-native";
import React, { useCallback, useEffect } from "react";
import styled from "../../pre-start/themes";
import { dp, vw } from '../../helper/resolution';
import Icon from '@expo/vector-icons/Feather';
import logo from "../../../assets/logo.png";
import { useAppDispatch } from "../../store/store";
import { resetStreak, disableBoxLoaded } from "../../store/progress";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../../route/game";

interface ToolbarProps {
  /** Enables the account button */
  accountButton: boolean;
  /** Enables the close button */
  closeAction?: () => void;
  /** Adds shadow under the toolbar */
  shadow: boolean;
  /** Enables the logo icon */
  logo: boolean;
  /** Number of navigation stack pops */
  popCount?: number;
  /** Function to handle a modal that closes activity */
  shouldQuit?: boolean;
}

const Container = styled.View`
  width: ${vw(100)}px;
  height: ${dp(40)}px;
  overflow: hidden;
  padding-bottom: ${dp(45)}px;
`;

const Shadow = styled.View`
  height: ${dp(40)}px;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.color.background};
  padding-left: ${dp(20)}px;
  padding-right: ${dp(20)}px;
`;

const Spacer = styled.View`
  width: ${dp(20)}px;
  height: ${dp(20)}px;
`;

/** Component that stays at the topmost part of the screen */
const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  const navigation = useNavigation<GameNavigatorProps>();
  const dispatch = useAppDispatch();
  /** Transports the user to the settings screen */
  const handleAccountPress = useCallback(() => {
    navigation.navigate("Settings");
  }, []);

  /** Returns the user to the previous screen */
  useEffect(() => {
    if (props.shouldQuit) {
      dispatch(resetStreak());
      dispatch(disableBoxLoaded());
      navigation.pop(props.popCount || 1);
    }
  }, [props.shouldQuit]);

  return (
    <Container>
      <Shadow
        style={ props.shadow ? {elevation: dp(5)} : {}}
      >
        {props.accountButton ? (
          <Icon
            size={dp(20)}
            name="user"
            style={{ color: "#8E8E8E" }}
            onPress={handleAccountPress}
          ></Icon>
        ) : (
          <Spacer></Spacer>
        )}
        {props.logo ? (
          <Image
            source={logo}
            style={{
              height: dp(20),
              width: dp(96),
            }}
            resizeMode="contain"
          ></Image>
        ) : (
          <Spacer></Spacer>
        )}
        {props.closeAction ? (
          <Icon
            name="x-circle"
            style={{ color: "#FF867A" }}
            onPress={props.closeAction}
            size={dp(20)}
          ></Icon>
        ) : (
          <Spacer></Spacer>
        )}
      </Shadow>
    </Container>
  );
};

export default Toolbar;
