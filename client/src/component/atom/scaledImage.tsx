import { Image as Img } from "react-native";
import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";
import { useState } from "react";

type ImageSize = {
  width: number,
  height: number
} | undefined;

const Image = styled.Image<{ size: ImageSize }>`
  width: 100%;
  height: ${dp(120)}px;
`;

interface ScaledImageProps {
  image: string,
  imageAlt: string
}

function ScaledImage(props: ScaledImageProps) {
  const [imageSize, setImageSize] = useState<ImageSize>(undefined);
  Img.getSize(props.image, (w, h) => { setImageSize({ width: w, height: h }) });

  return (
    <Image
      size={imageSize}
      source={{ uri: props.image }}
      accessibilityLabel={props.imageAlt}
      resizeMode="contain"
    />
  )
}

export default ScaledImage;