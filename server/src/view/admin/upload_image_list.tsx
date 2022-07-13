import React from "react";
import { Box } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";
import urlJoin from 'url-join'


const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record, property } = props;

  const origin = window.location.origin
  const srcImg: string = urlJoin(origin, record?.params[property.path]);
  return <Box>{srcImg ? <img src={srcImg} width="100px" /> : "no image"}</Box>;
};

export default Edit;
