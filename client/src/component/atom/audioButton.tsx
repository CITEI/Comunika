import IconButton, { IconButtonProps } from "./iconButton";
import React, { useCallback, useState } from "react";
import { Audio } from "expo-av";

export interface AudioButtonProps extends Omit<IconButtonProps, "icon"> {
  audio: string;
  blocked?: boolean;
  onPlay?: () => void;
  onFinish?: () => void;
}

/** Button that fires a sound */
const AudioButton: React.VoidFunctionComponent<AudioButtonProps> = (props) => {
  const { audio, blocked, onPlay, onFinish, onPress, ...rest } = props;
  const isBlocked = props.blocked || false;
  const [playing, setPlaying] = useState(false);

  const handlePress = useCallback(
    async (ev) => {
      if (onPress) onPress(ev);
      if (!playing && !isBlocked) {
        setPlaying(true);
        if (props.onPlay) props.onPlay();
        await Audio.Sound.createAsync(
          { uri: props.audio },
          { shouldPlay: true },
          (status) => {
            if (status["didJustFinish"]) {
              setPlaying(false);
              if (props.onFinish) props.onFinish();
            }
          }
        );
      }
    },
    [playing, audio, isBlocked, onPress]
  );

  return <IconButton {...rest} icon="sound" onPress={handlePress} />;
};

export default AudioButton;
