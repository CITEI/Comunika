import { dp } from "../../helper/resolution";
import React, { useCallback, useEffect, useState } from "react";
import styled from "../../pre-start/themes";
import IconButton from "../atom/iconButton";
import AudioButton from "../atom/audioButton";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

interface CarrouselProps {
  /** slides definition */
  slides: {
    /** image uri */
    image?: string;
    /** image alt description */
    imageAlt?: string;
    /** audio uri */
    audio?: string;
    uniqueText?: string;
    sideBySide?: boolean;
  }[];
  text: string;
  setText: (newText: string) => void;
}

const Container = styled.View`
  width: 100%;
  height: ${dp(100)}px;
  flex-flow: row;
  background: ${(props) => props.theme.color.secondary};
  align-items: center;
  justify-content: center;
`;

const Arrow = styled(IconButton)`
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: ${dp(20)}px;
  background: transparent;
  color: ${(props) => props.theme.color.primary};
`;

const Content = styled.View`
  height: 80%;
  flex: 1;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

const SideBySide = styled.View`
  flex: 1;
  flex-direction: row;
  height: 80%;
  gap: 10px;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  flex: 1;
`;

function Carrousel(props: CarrouselProps) {
  const [index, setIndex] = useState(0);

  const data = props.slides;
  const current = props.slides[index];

  /** Changes the current image to the next */
  const handleNext = useCallback(() => {
    setIndex((index + 1) % data.length);
  }, [index]);

  /** Changes the current image to the previous */
  const handlePrevious = useCallback(() => {
    if (index == 0) setIndex(data.length - 1);
    else setIndex(index - 1);
  }, [index]);

  useEffect(() => {
    props.setText(props.text.replace("$uniqueText", current.uniqueText ?? ""));
  }, [current]);

  return (
    <Container>
      <Arrow icon="caretleft" onPress={handlePrevious} />
      {current.sideBySide ? (
        <SideBySide>
          {current.image && (
            <StyledImage source={current.image} contentFit="contain" />
          )}
          {current.audio && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <AudioButton audio={current.audio} iconSize={"big"} />
            </View>
          )}
        </SideBySide>
      ) : (
        //TODO: algumas imagens precisam tocar embaixo
        <Content style={{
          height: "85%",
          alignSelf: "center"
        }}>
          {current.image && (
            <StyledImage
              source={current.image}
              contentFit="contain"
              style={{ marginBottom: current.audio ? dp(5) : 0 }}
            />
          )}
          {current.audio && (
            <AudioButton
              audio={current.audio}
              iconSize={current.image ? "normal" : "big"}
            />
          )}
        </Content>
      )}
      <Arrow icon="caretright" onPress={handleNext} />
    </Container>
  );
}

export default Carrousel;
