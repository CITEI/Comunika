import React, { useEffect, useState } from "react";
import {
  Label,
  Box,
  DropZone,
  DropZoneProps,
  DropZoneItem,
  CheckBox,
  CheckBoxProps,
} from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props;
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    // enables checkbox if image was previously defined (edit mode)
    if (record?.params[property.name]) setEditing(false);
  }, []);

  const handleDropZoneChange: DropZoneProps["onChange"] = (files) => {
    if (onChange) onChange(property.name, files[0]);
  };

  const image = record?.params[property.name];

  const handleCheckBoxChange: CheckBoxProps["onChange"] = (ev) => {
    setEditing(true);
  };

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      {editing ? (
        <Box>
          <DropZone onChange={handleDropZoneChange}>
            {image && !image && <DropZoneItem src={image} />}
          </DropZone>
          <Label variant="info">
            Extensions: {(property.custom.extensions as string[]).join(", ")}
          </Label>
        </Box>
      ) : (
        <Box p="xl">
          <CheckBox onChange={handleCheckBoxChange} />
          <Label inline ml="default">
            Change image
          </Label>
        </Box>
      )}
    </Box>
  );
};

export default Edit;
