import React, { useCallback } from "react";
import styled from "../pre-start/themes";
import { useNavigation } from "@react-navigation/native";
import { GameNavigatorProps } from "../route/game";
import useUserInfo from "../hooks/useUserInfo";
import MainContainer from "../component/atom/mainContainer";
import ContentContainer from "../component/atom/contentContainer";
import RawTitle from "../component/atom/title";
import { dp } from "../helper/resolution";
import { clearToken } from "../helper/settings";
import { resetStorage } from "../store/local/GameStorage";
import * as Updates from "expo-updates";
import ParentSettings from "../component/templates/parentSettings";
import { EducatorI, ParentI } from "../store/auth";
import EducatorSettings from "../component/templates/educatorSettings";

const Title = styled(RawTitle)`
  margin-top: ${dp(20)}px;
  margin-bottom: ${dp(20)}px;
`;

const Settings: React.VoidFunctionComponent = () => {
  const navigation = useNavigation<GameNavigatorProps>();
  const info = useUserInfo();

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
        <Title>Perfil</Title>
        {info.user == "Parent" ? (
          <ParentSettings
            user={info as ParentI}
            handleReturn={handleReturn}
            handleLogout={handleLogout}
          />
        ) : (
          <EducatorSettings
            user={info as EducatorI}
            handleReturn={handleReturn}
            handleLogout={handleLogout}
          />
        )}
      </ContentContainer>
    </MainContainer>
  ) : (
    <></>
  );
};

export default Settings;
