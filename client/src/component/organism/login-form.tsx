import React from "react";
import Form from "../molecule/form";

interface FormProps {
  onSubmit: (inputs: Map<string, string>) => void;
}

const LoginForm: React.VoidFunctionComponent<FormProps> = (props) => {
  return (
    <Form
      inputs={[
        { type: "text", label: "Email", name: "email" },
        { type: "password", label: "Password", name: "password" },
      ]}
      onSubmit={props.onSubmit} buttonLabel="Login"
    />
  );
};

export default LoginForm;
