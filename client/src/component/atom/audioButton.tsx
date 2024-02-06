import IconButton, { IconButtonProps } from "./iconButton";
import React, { useEffect } from "react";
import {
  AVPlaybackStatus,
  AVPlaybackStatusError,
  AVPlaybackStatusSuccess,
  Audio,
} from "expo-av";
import { Foundation } from "@expo/vector-icons";
import styled from "../../pre-start/themes";
import { TouchableOpacity } from "react-native";
import { dp, sp } from "../../helper/resolution";

export interface AudioButtonProps extends Omit<IconButtonProps, "icon"> {
  audio: string;
  iconSize?: "small" | "normal" | "big";
}

const Icon = styled(Foundation)<{ $iconSize?: string }>`
  font-size: ${(props) => {
    switch (props.$iconSize) {
      case "small":
        return sp(12);
      case "normal":
        return sp(16);
      case "big":
        return sp(32);
    }
  }}px;
  color: #424242;
`;

const Container = styled(TouchableOpacity)`
  background: ${(props) => props.theme.color.primary};
  align-items: center;
  justify-content: center;
  align-self: center;
`;

/** Button that fires a sound */
function AudioButton(props: AudioButtonProps) {
  const { audio, iconSize, ...other } = props;
  const sound = new Audio.Sound();

  // Unloads the sound when it finishes playinb back
  const statusUpdate = async (
    playbackStatus:
      | AVPlaybackStatus
      | AVPlaybackStatusSuccess
      | AVPlaybackStatusError
  ) => {
    if (playbackStatus.isLoaded) {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync();
      }
    }
  };

  sound.setOnPlaybackStatusUpdate(statusUpdate);

  // loads and plays the sound, restart if pressed again during playback
  async function playSound() {
    if (sound._loaded) {
      await sound.replayAsync();
    } else {
      await sound.loadAsync({ uri: audio });
      await sound.playAsync();
    }
  }

  // Stops playing audio if the component is unmounted.
  useEffect(() => {
    return () => {
      sound.unloadAsync();
    };
  }, [sound]);

  function getWidth() {
    switch (props.iconSize ?? "normal") {
      case "small":
        return dp(20);
      case "normal":
        return dp(30);
      case "big":
        return dp(60);
    }
  }

  function getHeight() {
    switch (props.iconSize ?? "normal") {
      case "small":
        return dp(15);
      case "normal":
        return dp(20);
      case "big":
        return dp(40);
    }
  }

  function getBorderRadious() {
    switch (props.iconSize ?? "normal") {
      case "small":
        return dp(5);
      case "normal":
        return dp(5);
      case "big":
        return dp(10);
    }
  }

  return (
    <Container
      onPress={playSound}
      style={{
        width: getWidth(),
        height: getHeight(),
        borderRadius: getBorderRadious(),
      }}
      {...other}
    >
      <Icon name="volume" $iconSize={props.iconSize ?? "normal"} />
    </Container>
  );
}

export default AudioButton;
