import useDisabilities from "../../hooks/useDisabilities";
import { EducatorI } from "../../store/auth";
import RawForm from "../organism/form";
import styled from "styled-components";
import { dp } from "../../helper/resolution";

const Form = styled(RawForm)`
  margin-bottom: ${dp(20)}px;
`;

interface props {
  user: EducatorI;
  handleReturn(): void;
  handleLogout(): Promise<void>;
}

function EducatorSettings(props: props) {
  const disabilities = useDisabilities().map((disability) => ({
    option: disability.name,
    value: disability._id,
  }));

  return (
    <Form
      inputs={[
        {
          type: "text",
          label: "Email",
          name: "email",
          value: props.user.email,
          editable: false,
        },
        {
          type: "text",
          label: "Nome do educador",
          name: "name",
          value: props.user.name,
          editable: false,
        },
        {
          type: "text",
          label: "Nome da escola",
          name: "school",
          value: props.user.school,
          editable: false,
        },
        {
          type: "text",
          label: "Quantidade de crianças que trabalha",
          name: "quantity",
          value: props.user.numberOfDisabledStudents.toString(),
          editable: false,
        },
        {
          type: "checkboxset",
          label: "Deficiências das crianças",
          name: "disabilities",
          options: disabilities,
          editable: false,
          selected: props.user.disabilities,
        },
        {
          type: "button",
          label: "Voltar",
          name: "return",
          onPress: props.handleReturn,
        },
        {
          type: "button",
          label: "Sair",
          name: "logout",
          onPress: props.handleLogout,
        },
      ]}
    />
  );
}

export default EducatorSettings;
