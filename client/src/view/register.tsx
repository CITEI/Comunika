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
import RelationSelection from "../component/organism/relationSelection";
import EducatorRegisterForm from "../component/templates/educatorRegister";
import styled from "../pre-start/themes";
import RawText from "../component/atom/text";
import { dp } from "../helper/resolution";

const isLongerThanTwo = (txt: string) => txt.length > 2;

const Problems = styled.View`
  margin-top: ${dp(10)}px;
  border-radius: ${dp(20)}px;
  padding: ${dp(10)}px;
  border: ${dp(2)}px #ff5f5f;
`;

const Text = styled(RawText)`
  font-family: ${(props) => props.theme.fontFamily.textSemiBold};
  margin-bottom: ${dp(4)}px;
`;

const errorTexts: { [key: string]: string } = {
  name: "O nome precisa ser preenchido.",
  email: "E-mail inválido.",
  confirm: "As senhas digitadas não são iguais.",
  password: "A senha precisa ter 8 caracteres ou mais.",
  disabilities: "Por favor, selecione ao menos uma das deficiências.",
  tos: "Aceite os termos de uso e privacidade para continuar.",
  relationship: "Relação com a criança deve ser preenchida",
  birth: "A data de nascimento deve ser preenchida.",
  region: "A região onde mora deve ser preeenchida.",
  school: "O nome da escola deve ser preenchido",
  numberOfDisabledStudents:
    "O número de estudantes da escola deve ser um dígito.",
};

const validators = {
  name: isLongerThanTwo,
  email: isEmail,
  password: isPassword,
  confirm: isLongerThanTwo,
  disabilities: (arr: string[]) => arr.length >= 0,
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
  const [problems, setProblems] = useState<Array<string>>([]);

  const handleSelection = (state: string): void => {
    state == "parent" ? setIsParent(true) : setIsParent(false);
    setProblems([]);
  };

  const handleChange = (map: Map<string, any>) => {
    const validator = isParent ? parentValidator : educatorValidator;
    for (const key of Object.keys(validator)) {
      if (key == "confirm" && map.get(key) != map.get("password")) {
        if (!problems.includes(key)) {
          setProblems([key, ...problems]);
          setValidated(false);
        }
      } else if (!map.has(key) || !validator[key](map.get(key))) {
        if (!problems.includes(key)) {
          setProblems([key, ...problems]);
          setValidated(false);
        }
      } else {
        if (problems.includes(key)) {
          setProblems(problems.filter((p) => p != key));
        }
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
        {problems.length > 0 && (
          <Problems>
            {problems.map((p) => {
              return <Text key={p}>- {errorTexts[p]}</Text>;
            })}
          </Problems>
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
