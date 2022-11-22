import { Image } from "react-native";
import React, { useCallback } from "react";
import styled from "../../pre-start/themes";
import { dp, vw } from "../../helper/resolution";
import ToolbarButton from "../atom/toolbar-button";
import logo from "../../../assets/logo_2.png";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../../route/game";

interface ToolbarProps {
  /** Enables the account button */
  accountButton: boolean;
  /** Enables the close button */
  closeButton: boolean;
  /** Adds shadow under the toolbar */
  shadow: boolean;
  /** Enables the logo icon */
  logo: boolean;
  /** Number of navigation stack pops */
  popCount?: number;
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

  /** Transports the user to the settings screen */
  const handleAccountPress = useCallback(() => {
    navigation.navigate("Settings");
  }, []);

  /** Returns the user to the previous screen */
  const handleClosePress = useCallback(() => {
    navigation.pop(props.popCount || 1);
  }, [props.popCount]);

  return (
    <Container>
      <Shadow
        style={
          props.shadow
            ? {
                elevation: dp(5),
              }
            : {}
        }
      >
        {props.accountButton ? (
          <ToolbarButton
            name="user"
            style={{ color: "#8E8E8E" }}
            onPress={handleAccountPress}
          ></ToolbarButton>
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
        {props.closeButton ? (
          <ToolbarButton
            name="x-circle"
            style={{ color: "#FF867A" }}
            onPress={handleClosePress}
          ></ToolbarButton>
        ) : (
          <Spacer></Spacer>
        )}
      </Shadow>
    </Container>
  );
};

export default Toolbar;
