import React from "react";
import t from "../../pre-start/i18n";
import Form from "../molecule/form";

interface FormProps {
  onSubmit: (inputs: Map<string, string>) => void;
}

const LoginForm: React.VoidFunctionComponent<FormProps> = (props) => {
  return (
    <Form
      inputs={[
        { type: "text", label: t("Email"), name: "email" },
        { type: "password", label: t("Password"), name: "password" },
      ]}
      onSubmit={props.onSubmit} buttonLabel={t("Login")}
    />
  );
};

export default LoginForm;
