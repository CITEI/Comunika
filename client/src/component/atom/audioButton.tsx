import IconButton, { IconButtonProps } from "./iconButton";
import React, { useEffect } from "react";
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, Audio } from "expo-av";

export interface AudioButtonProps extends Omit<IconButtonProps, "icon"> {
  audio: string;
}

/** Button that fires a sound */
function AudioButton(props: AudioButtonProps) {
  const { audio, ...rest } = props;
  const sound = new Audio.Sound();
  
  // Unloads the sound when it finishes playinb back
  const statusUpdate = async (playbackStatus: AVPlaybackStatus | AVPlaybackStatusSuccess | AVPlaybackStatusError) => {
    if (playbackStatus.isLoaded) {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync();
      }
    }
  }

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
      sound.unloadAsync()
    }
  }, [sound])

  return <IconButton {...rest} icon="sound" onPress={playSound} />;
}

export default AudioButton;
  