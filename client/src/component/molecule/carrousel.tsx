import { dp } from "../../helper/resolution";
import React, { useCallback, useEffect, useState } from "react";
import styled from "../../pre-start/themes";
import IconButton from "../atom/iconButton";
import AudioButton from "../atom/audioButton";
import { TouchableOpacity } from "react-native";
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
  }[];
  preview?: boolean;
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
  flex: 1;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding-top: ${dp(5)}px;
`;

const StyledImage = styled(Image)`
  flex: 2;
  width: 100%;
  height: 100%;
`;

const Preview = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  gap: ${dp(8)}px;
  width: 100%;
  height: 100%;
  padding: ${dp(8)}px;
  padding-left: ${dp(10)}px;
  padding-right: ${dp(10)}px;
`;

const Group = styled.View`
  width: 100%;
  height: ${dp(80)}px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
`;

const Icon = styled(Image)`
  flex: 1;
  margin-bottom: ${dp(5)}px;
`;

function Carrousel(props: CarrouselProps) {
  const [preview, setPreview] = useState<boolean>(props.preview || false);
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

  const handlePreview = useCallback(() => {
    setPreview(false);
  }, [preview]);

  useEffect(() => {
    props.setText(props.text.replace("$uniqueText", current.uniqueText ?? ""));
  }, [current]);

  return (
    <Container style={{paddingBottom: current.audio || preview ? dp(5) : 0}}>
      {preview ? (
        <Preview onPress={handlePreview}>
          {props.slides
            .filter((el) => "image" in el)
            .map((el, i) => (
              <Group key={i}>
                <Icon
                  key={i}
                  source={el.image}
                  contentFit="contain"
                  contentPosition={"bottom"}
                />
                {el.audio && <AudioButton audio={el.audio} iconSize="small" />}
              </Group>
            ))}
        </Preview>
      ) : (
        <>
          <Arrow icon="caretleft" onPress={handlePrevious} />
          <Content>
            {current.image && (
              <StyledImage source={current.image} contentFit="contain" style={{marginBottom: current.audio ? dp(5) : 0}}/>
            )}
            {current.audio && (
              <AudioButton
                audio={current.audio}
                iconSize={current.image ? "normal" : "big"}
              />
            )}
          </Content>
          <Arrow icon="caretright" onPress={handleNext} />
        </>
      )}
    </Container>
  );
}

export default Carrousel;
