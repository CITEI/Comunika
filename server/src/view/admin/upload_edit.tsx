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
import { EditPropertyProps } from "adminjs";
import ConditionalProperty, {
  ConditionalPropertyCustom,
} from "./conditional_property";

interface UploadImageEditCustom extends Partial<ConditionalPropertyCustom> {}

const Edit: React.FC<EditPropertyProps> = (props) => {
  const { property, onChange, record } = props;
  const [editing, setEditing] = useState(true);
  const custom: UploadImageEditCustom = property.custom;
  custom["initialState"] = true;

  useEffect(() => {
    // enables checkbox if image was previously defined (edit mode)
    if (record?.params[property.path]) setEditing(false);
  }, [custom["initialState"]]);

  const handleDropZoneChange: DropZoneProps["onChange"] = (files) => {
    if (onChange) onChange(property.path, files[0]);
  };

  const image = record?.params[property.path];

  const handleCheckBoxChange: CheckBoxProps["onChange"] = (ev) => {
    setEditing(true);
  };

  return (
    <ConditionalProperty {...props}>
      <Box marginBottom="xxl">
        <Label>{property.label}</Label>
        {editing ? (
          <Box>
            <DropZone onChange={handleDropZoneChange}/>
            <Label variant="info">
              Extensions: {(property.custom.extensions as string[]).join(", ")}
            </Label>
          </Box>
        ) : (
          <Box p="xl">
            <CheckBox onChange={handleCheckBoxChange} />
            <Label inline ml="default">
              Change
            </Label>
          </Box>
        )}
      </Box>
    </ConditionalProperty>
  );
};

export default Edit;
