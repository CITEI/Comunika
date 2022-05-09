import React from "react";
import Form from "../molecule/form";

interface RegisterFormProps {
  onSubmit: (map: Map<string, string>) => void;
}

const RegisterForm: React.VoidFunctionComponent<RegisterFormProps> = (
  props
) => {
  return (
    <Form
      inputs={[
        { type: "text", label: "Email", name: "email" },
        { type: "password", label: "Password", name: "password" },
        { type: "text", label: "Name", name: "name" },
      ]}
      onSubmit={props.onSubmit}
      buttonLabel="Register"
    />
  );
};

export default RegisterForm;
