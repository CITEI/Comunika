import React from "react";
import styled from "../pre-start/themes";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import useHistory from "../hooks/usehistory";
import useUserInfo from "../hooks/useuserinfo";
import useDisabilities from "../hooks/usedisabilities";
import RawForm from "../component/organism/form";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import RawTitle from "../component/atom/title";
import { dp } from "../helper/resolution";
import moment from "moment";

const Title = styled(RawTitle)`
  margin-top: ${dp(20)}px;
  margin-bottom: ${dp(20)}px;
`

const Form = styled(RawForm)`
  margin-bottom: ${dp(20)}px;
`

const Settings: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const info = useUserInfo();
  const rawDisabilities = useDisabilities();
  const disabilities = rawDisabilities.map((disability) => ({
    option: disability.name,
    value: disability._id,
  }));
  const birth = info.birth ? moment(info.birth).format("DD/MM/YYYY") : "";

  const handleReturn = () => {
    navigation.pop();
  };

  return (
    <MainContainer>
      <ContentContainer>
        <Title>{t("Profile")}</Title>
        <Form
          inputs={[
            {
              type: "text",
              label: t("Email"),
              name: "email",
              value: info.email,
              editable: false,
            },
            {
              type: "text",
              label: t("Birth"),
              name: "birth",
              value: birth,
              editable: false,
            },
            {
              type: "text",
              label: t("Guardian"),
              name: "guardian",
              value: info.guardian,
              editable: false,
            },
            {
              type: "text",
              label: t("Relationship"),
              name: "relationship",
              value: info.relationship,
              editable: false,
            },
            {
              type: "checkboxset",
              label: t("Comorbidities"),
              name: "comorbidities",
              options: disabilities,
              editable: false,
              selected: info.comorbidity,
            },
            {
              type: "button",
              label: t("Return"),
              name: "return",
              onPress: handleReturn,
            },
          ]}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default Settings;
