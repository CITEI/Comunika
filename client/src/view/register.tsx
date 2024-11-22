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

function ProblemsComponent(problems: string[]) {
  if (problems.length === 0) return null;

  const texts = problems.map((p, index) => {
    return <Text key={index}>- {errorTexts[p]}</Text>;
  });

  return <Problems>{texts}</Problems>;
}

const Text = styled(RawText)`
  font-family: ${(props) => props.theme.fontFamily.textSemiBold};
  margin-bottom: ${dp(4)}px;
`;

const errorTexts: { [key: string]: string } = {
  name: "O nome precisa ser preenchido.",
  email: "E-mail inválido.",
  confirm: "As senhas digitadas não são iguais.",
  password: "A senha precisa ter 6 caracteres ou mais.",
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
  name: {
    required: true,
    fun: (str: string) => str.length > 0,
  },
  email: {
    required: true,
    fun: isEmail,
  },
  password: {
    required: true,
    fun: isPassword,
  },
  confirm: {
    required: true,
    fun: (str: string, map: Map<string, any>) => str === map.get("password"),
  },
  disabilities: {
    required: true,
    fun: (arr: Array<string>) => arr.length >= 0,
  },
  tos: {
    required: true,
    fun: (accepted: boolean) => accepted,
  },
};

const parentValidator = {
  ...validators,
  relationship: {
    required: false,
    fun: (str: string) => str.length > 0,
  },
  birth: {
    required: false,
    fun: (date: Date) => true,
  },
  region: {
    required: false,
    fun: (str: string) => str.length > 0,
  },
};

const educatorValidator = {
  ...validators,
  school: {
    required: false,
    fun: (str: string) => str.length > 0,
  },
  numberOfDisabledStudents: {
    required: false,
    fun: (str: string) => !isNaN(Number(str)),
  },
};

function Register() {
  const authenticated = useAppSelector(
    (state) => state.auth.authentication.status
  );
  const navigation = useNavigation<AuthNavigatorProps>();
  const dispatch = useAppDispatch();
  const [map, setMap] = useState(new Map<string, any>());
  const [validated, setValidated] = useState(false);
  const [isParent, setIsParent] = useState(true);
  const [problems, setProblems] = useState<string[]>([]);

  const handleSelection = (state: string): void => {
    state == "parent" ? setIsParent(true) : setIsParent(false);
    setMap(new Map<string, any>());
  };

  useEffect(() => {
    const validators: {
      [key: string]: {
        required: boolean;
        fun: (...args: any) => boolean;
      };
    } = isParent ? parentValidator : educatorValidator;

    let newProblem = [...problems];

    for (const key of Object.keys(validators)) {
      const value = map.get(key);

      if (validators[key].required && !value) {
        if (!newProblem.includes(key)) newProblem.push(key);
      } else if (value && !validators[key].fun(value, map)) {
        if (!newProblem.includes(key)) newProblem.push(key);
      } else {
        newProblem = newProblem.filter((p) => p !== key);
      }
    }

    setProblems(newProblem);
    setValidated(newProblem.length === 0);
  }, [map]);

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
            handleChange={setMap}
            validated={validated}
          />
        ) : (
          <EducatorRegisterForm
            handleSubmit={handleSubmit}
            handleChange={setMap}
            validated={validated}
          />
        )}
        {ProblemsComponent(problems)}
        <TextLink
          style={{ paddingTop: 0 }}
          text={"Já é usuário?" + " "}
          link={"Clique aqui"}
          onPress={handleLogin}
        />
      </ContentContainer>
    </MainContainer>
  );
}

export default Register;
