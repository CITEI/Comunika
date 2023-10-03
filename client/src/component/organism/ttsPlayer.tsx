import React, { useCallback, useState } from "react";
import ShadowPanel, { ShadowPanelProps } from "../atom/shadowPanel";
import * as Speech from "expo-speech";
import Icon from "@expo/vector-icons/AntDesign";
import { sp, dp } from "../../helper/resolution";
import styled from "../../pre-start/themes";

interface TTSPlayerProps extends ShadowPanelProps {
  text: string;
}

enum PlayerState {
  Playing,
  Stopped,
}

const Container = styled(ShadowPanel)`
  padding: ${dp(12)}px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const Button = styled(Icon)`
  font-size: ${sp(16)}px;
  color: ${(props) => props.theme.color.primary};
`;

const PlayButton = styled(Button)`
  font-size: ${sp(24)}px;
`;

/** A minimal text reader using TTS */
function TTSPlayer(props: TTSPlayerProps) {
  const [state, setState] = useState(PlayerState.Stopped);

  /** Stops a tts speech */
  const handleStop = useCallback(async () => {
    await Speech.stop();
    setState(PlayerState.Stopped);
  }, []);

  /** Plays/Pauses/Resumes a tts speech */
  const handlePlay = useCallback(async () => {
    if (state == PlayerState.Playing) {
      await Speech.stop();
      setState(PlayerState.Stopped);
    } else {
      Speech.speak(props.text, {
        onDone: () => setState(PlayerState.Stopped),
      });
      setState(PlayerState.Playing);
    }
  }, [props.text, state]);

  return (
    <Container elevation={7} {...props}>
      <Button name="fastbackward" onPress={handleStop} />
      <PlayButton
        name={state == PlayerState.Playing ? "pausecircle" : "play"}
        onPress={handlePlay}
      />
      <Button name="fastforward" onPress={handleStop} />
    </Container>
  );
};

export default TTSPlayer;
