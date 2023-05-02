import React, { useCallback } from "react";
import styled from "../pre-start/themes";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import useUserInfo from "../hooks/useUserInfo";
import useDisabilities from "../hooks/usedisabilities";
import RawForm from "../component/organism/form";
import MainContainer from "../component/atom/main-container";
import ContentContainer from "../component/atom/content-container";
import t from "../pre-start/i18n";
import RawTitle from "../component/atom/title";
import { dp } from "../helper/resolution";
import moment from "moment";
import { clearToken } from "../helper/settings";
import { resetStorage } from '../store/local/GameStorage';
import * as Updates from "expo-updates";

const Title = styled(RawTitle)`
  margin-top: ${dp(20)}px;
  margin-bottom: ${dp(20)}px;
`;

const Form = styled(RawForm)`
  margin-bottom: ${dp(20)}px;
`;

const Settings: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const info = useUserInfo();
  const rawDisabilities = useDisabilities();
  const disabilities = rawDisabilities.map((disability) => ({
    option: disability.name,
    value: disability._id,
  }));
  const birth = info?.birth ? moment(info.birth).format("DD/MM/YYYY") : "";

  const handleReturn = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    await resetStorage();
    await clearToken();
    await Updates.reloadAsync();
  }, []);

  return info ? (
    <MainContainer>
      <ContentContainer>
        <Title>{"Perfil"}</Title>
        <Form
          inputs={[
            {
              type: "text",
              label: "Email",
              name: "email",
              value: info.email,
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
              name: "guardian",
              value: info.guardian,
              editable: false,
            },
            {
              type: "text",
              label: "Grau de parentesco",
              name: "relationship",
              value: info.relationship,
              editable: false,
            },
            {
              type: "checkboxset",
              label: "Deficiências da criança",
              name: "disabilities",
              options: disabilities,
              editable: false,
              selected: info.disabilities,
            },
            {
              type: "button",
              label: "Voltar",
              name: "return",
              onPress: handleReturn,
            },
            {
              type: "button",
              label: "Sair",
              name: "logout",
              onPress: handleLogout,
            },
          ]}
        />
      </ContentContainer>
    </MainContainer>
  ) : (
    <></>
  );
};

export default Settings;
