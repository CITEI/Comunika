import React from "react";
import { Box } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";
import urlJoin from "url-join";


/**
 * Required because adminjs doesn't support custom libs
 */
const EXTENSIONS = {
  image: new Set(["png", "jpg", "jpeg", "gif"]),
  video: new Set(["mp4", "webm"]),
  audio: new Set(["mp3", "wav", "ogg"])
}

/**
 * Gets the mime type from a file path extension.
 */
export function getMimeType(filepath: string): string | undefined {
  const extension = filepath.split(".").pop() || "";
  console.log(extension)
  for (const type of Object.keys(EXTENSIONS))
    if (EXTENSIONS[type].has(extension)) return `${type}/${extension}`;
  return undefined;
}

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record, property } = props;

  const origin = window.location.origin;
  const subPath: string | undefined = record?.params?.[property.path];
  const srcResource: string | undefined = subPath
    ? urlJoin(origin, subPath)
    : undefined;
  const type = (getMimeType(subPath || "") || "").split("/")[0];

  return (
    <Box>
      {(() => {
        if (srcResource)
          switch (type) {
            case "image":
              return <img src={srcResource} width="100px" />;
            case "audio":
              return (
                <audio controls>
                  <source src={srcResource} />
                </audio>
              );
            default:
              return srcResource;
          }
        else return "";
      })()}
    </Box>
  );
};

export default Edit;
