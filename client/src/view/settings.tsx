import React, { useCallback } from "react";
import styled from "../pre-start/themes";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import useUserInfo from "../hooks/useUserInfo";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import RawTitle from "../component/atom/title";
import { dp, sp } from "../helper/resolution";
import { clearToken } from "../helper/settings";
import { resetStorage } from "../store/local/GameStorage";
import * as Updates from "expo-updates";
import ParentSettings from "../component/templates/parentSettings";
import { EducatorI, ParentI } from "../store/auth";
import EducatorSettings from "../component/templates/educatorSettings";
import { Image } from "expo-image";
import logo from "../../assets/logo.png";
import Text from "../component/atom/text";
import { Linking } from "react-native";

const Header = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${dp(40)}px;
  margin-bottom: ${dp(10)}px;
`;

const Logo = styled(Image)`
  width: ${dp(150)}px;
  height: ${dp(30)}px;
`;

const Title = styled(RawTitle)`
  margin-top: ${dp(20)}px;
  margin-bottom: ${dp(18)}px;
`;

const ClickableText = styled(Text)`
  font-family: ${(props) => props.theme.fontFamily.textExtraBold};
  font-size: ${sp(15)}px;
  color: ${(props) => props.theme.color.primary};
  margin-top: ${dp(18)}px;
`;

function Settings() {
  const navigation = useNavigation<GameNavigatorProps>();
  const info = useUserInfo();

  const openDeleteAccount = () => {
    Linking.openURL("http://comunizika.im.ufrrj.br/api/v1/delete-account");
  };

  const handleLogout = useCallback(async () => {
    await resetStorage();
    await clearToken();
    await Updates.reloadAsync();
  }, []);

  return info ? (
    <MainContainer>
      <Header>
        <Logo source={logo} contentFit="contain" />
      </Header>
      <ContentContainer>
        <Title>Perfil</Title>
        {info.user == "Parent" ? (
          <ParentSettings user={info as ParentI} />
        ) : (
          <EducatorSettings user={info as EducatorI} />
        )}
        <ClickableText onPress={handleLogout}>Sair do Aplicativo</ClickableText>
        <ClickableText onPress={openDeleteAccount}>Excluir Conta</ClickableText>
      </ContentContainer>
    </MainContainer>
  ) : (
    <></>
  );
}

export default Settings;
