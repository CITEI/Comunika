import RawText from "../atom/text";
import React from "react";
import { Linking } from "react-native";
import styled from "../../pre-start/themes";
import { sp, dp } from "../../helper/resolution";

const Container = styled(RawText)`
  font-size: ${sp(15)}px;
  padding-left: ${dp(10)}px;
  padding-bottom: 0;
`;

const Link = styled(RawText)`
  font-size: ${sp(15)}px;
  color: ${(props) => props.theme.color.primary};
  font-weight: bold;
`;

function ToS() {
  return (
    <Container>
      <>Eu aceito os </>
      <Link
        onPress={() =>
          Linking.openURL(
            "https://drive.google.com/file/d/1mF5b8NPe_Q440TNOy8p0o95Id7p4hxaq/view?usp=sharing"
          )
        }
      >
        Termos de Uso
      </Link>
      <> e a </>
      <Link
        onPress={() =>
          Linking.openURL(
            "https://drive.google.com/file/d/1QnnRapUrBLsibsdB3RK-Ym1fuTMqUp2N/view?usp=drive_link"
          )
        }
      >
        Política de Privacidade
      </Link>
      <RawText>.</RawText>
    </Container>
  );
}

export default ToS;
