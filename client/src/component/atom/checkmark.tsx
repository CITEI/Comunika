import React, { useEffect, useState } from "react";
import styled from "../../pre-start/themes";
import { dp } from "../../helper/resolution";

export interface CheckmarkProps {
  value?: boolean;
  onSelected: (selected: boolean) => void;
}

const Marker = styled.View.attrs((props: CheckmarkProps) => props)`
  width: ${(props) => dp(13)}px;
  height: ${(props) => dp(13)}px;
  background-color: ${(props) =>
    props.value ? props.theme.color.primary : props.theme.color.inputBorder};
`;

/** Checkbox marker */
const Checkmark: React.VoidFunctionComponent<CheckmarkProps> = (props) => {
  const [selected, setSelected] = useState(props.value || false);

  useEffect(() => {
    setSelected(props.value || false);
  }, [props.value]);

  return <Marker value={selected} />;
};

export default Checkmark;
