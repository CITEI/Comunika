import React, { useCallback, useEffect, useState } from "react";
import { registerEducator, registerParent } from "../store/auth";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProps } from "../route/auth";
import ContentContainer from "../component/atom/contentContainer";
import MainContainer from "../component/atom/mainContainer";
import LoginHeader from "../component/organism/loginHeader";
import ParentRegisterForm from "../component/templates/parentRegister";
import TextLink from "../component/molecule/textLink";
import { isEmail, isPassword } from "../helper/validators";
import ToS from "../component/molecule/tos";
import RelationSelection from "../component/organism/relationSelection";
import EducatorRegisterForm from "../component/templates/educatorRegister";

const isLongerThanTwo = (txt: string) => txt.length > 2;

const validators = {
  name: isLongerThanTwo,
  email: isEmail,
  password: isPassword,
  confirm: isPassword,
  disabilities: (arr: string[]) => arr.length > 0,
  tos: (accepted: boolean) => accepted,
};

const parentValidator = {
  ...validators,
  relationship: isLongerThanTwo,
  birth: (date: Date) => true,
  region: isLongerThanTwo,
};

const educatorValidator = {
  ...validators,
  school: isLongerThanTwo,
  numberOfDisabledStudents: (t: number) => !isNaN(t),
};

const Register: React.VoidFunctionComponent = () => {
  const authenticated = useAppSelector(
    (state) => state.auth.authentication.status
  );
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const [isParent, setIsParent] = useState(true);

  const handleSelection = (state: string): void => {
    state == "parent" ? setIsParent(true) : setIsParent(false);
  };

  const handleChange = (map: Map<string, any>) => {
    const validator = isParent ? parentValidator : educatorValidator;
    for (const key of Object.keys(validator)) {
      if (!map.has(key) || !validator[key](map.get(key))) {
        setValidated(false);
        return;
      }
    }
    if (map.get("password") != map.get("confirm")) setValidated(false);
    else setValidated(true);
  };

  const handleSubmit = useCallback(
    (map: Map<string, string>) => {
      const userData = {
        email: map.get("email"),
        password: map.get("password"),
        name: map.get("name"),
        disabilities: map.get("disabilities"),
      } as any;
      if (isParent) {
        dispatch(
          registerParent({
            ...userData,
            relationship: map.get("relationship"),
            region: map.get("region"),
            birth: map.get("birth"),
          } as any)
        );
      } else {
        dispatch(
          registerEducator({
            ...userData,
            school: map.get("school"),
            numberOfDisabledStudents: Number(
              map.get("numberOfDisabledStudents")
            ),
          } as any)
        );
      }
    },
    [dispatch, isParent]
  );

  const handleLogin = useCallback(() => {
    navigation.replace("Login");
  }, [navigation]);

  useEffect(() => {
    if (authenticated) navigation.navigate("Onboarding");
  }, [authenticated]);

  return (
    <MainContainer>
      <ContentContainer>
        <LoginHeader />
        <RelationSelection handle={handleSelection} parentSelected={isParent} />
        {isParent ? (
          <ParentRegisterForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            validated={validated}
          />
        ) : (
          <EducatorRegisterForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            validated={validated}
          />
        )}
        <TextLink
          style={{ paddingTop: 0 }}
          text={"Já é usuário?" + " "}
          link={"Clique aqui"}
          onPress={handleLogin}
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default Register;
