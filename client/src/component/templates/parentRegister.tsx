import Form from "../organism/form";
import useDisabilities from "../../hooks/useDisabilities";
import Text from "../atom/text";
import ToS from "../molecule/tos";

interface props {
  handleSubmit(map: Map<string, string>): void;
  handleChange(map: Map<string, any>): void;
  validated: boolean;
}

function ParentRegisterForm(props: props) {
  const disabilities = useDisabilities();

  return (
    <Form
      inputs={[
        {
          type: "text",
          label: "Nome do responsável*",
          name: "name",
        },
        { type: "text", label: "E-mail*", name: "email" },
        { type: "password", label: "Senha*", name: "password" },
        { type: "password", label: "Confirmar senha*", name: "confirm" },
        {
          type: "text",
          label: "Relação com a criança (mãe, pai, tio...)",
          name: "relationship",
        },
        { type: "date", label: "Data de nascimento da criança", name: "birth" },
        { type: "text", label: "Região que mora", name: "region" },
        {
          type: "checkboxset",
          label: "Deficiências da criança",
          name: "disabilities",
          options: disabilities.map((el) => ({
            option: el.name,
            value: el._id,
          })),
        },
        {
          type: "checkbox",
          label: "ToS",
          customLabel: <ToS />,
          name: "tos",
        },
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

export default ParentRegisterForm;
