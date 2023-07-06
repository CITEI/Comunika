import moment from "moment";
import useDisabilities from "../../hooks/usedisabilities";
import { ParentI } from "../../store/auth"
import RawForm from "../organism/form";
import styled from "styled-components";
import { dp } from "../../helper/resolution";

const Form = styled(RawForm)`
  margin-bottom: ${dp(20)}px;
`;

interface props {
  user: ParentI, 
  handleReturn(): void,
  handleLogout(): Promise<void>
}

function ParentSettings(props: props) {
  const disabilities = useDisabilities().map((disability) => ({
    option: disability.name,
    value: disability._id,
  }));

  const birth = moment(props.user.birth).format("DD/MM/YYYY");

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
          label: "Data de nascimento",
          name: "birth",
          value: birth,
          editable: false,
        },
        {
          type: "text",
          label: "Responsável",
          name: "name",
          value: props.user.name,
          editable: false,
        },
        {
          type: "text",
          label: "Grau de parentesco",
          name: "relationship",
          value: props.user.relationship,
          editable: false,
        },
        {
          type: "checkboxset",
          label: "Deficiências da criança",
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
  )
}

export default ParentSettings;