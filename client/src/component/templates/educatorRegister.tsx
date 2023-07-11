import { useState } from "react";
import Form from "../organism/form";
import useDisabilities from "../../hooks/useDisabilities";
import { isEmail, isPassword } from "../../helper/validators";

const isLongerThanTwo = (txt: string) => txt.length > 2;

interface props {
  handleSubmit(map: Map<string, string>): void;
  handleChange(map: Map<string, any>): void;
  validated: boolean;
}

function EducatorRegisterForm(props: props) {
  const disabilities = useDisabilities();

  return (
    <Form
      inputs={[
        {
          type: "text",
          label: "Nome do educador",
          name: "name",
        },
        {
          type: "text",
          label: "Nome da escola que trabalha",
          name: "school",
        },
        {
          type: "text",
          label: "Com quantas crianças com deficiência trabalha?",
          name: "numberOfDisabledStudents",
        },
        {
          type: "checkboxset",
          label: "Deficiências das crianças",
          name: "disabilities",
          options: disabilities.map((el) => ({
            option: el.name,
            value: el._id,
          })),
        },
        { type: "text", label: "E-mail", name: "email" },
        { type: "password", label: "Senha", name: "password" },
        { type: "password", label: "Confirmar senha", name: "confirm" },
        {
          type: "submit",
          label: "Entrar",
          name: "submit",
          onSubmit: props.handleSubmit,
          disabled: !props.validated,
        },
      ]}
      onChange={props.handleChange}
    />
  );
}

export default EducatorRegisterForm;
