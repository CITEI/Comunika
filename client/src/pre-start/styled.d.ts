import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    padding: {
      input: string;
    },
    height: {
      input: string;
    },
    borderColor: {
      input: string;
    },
    borderRadius: {
      input: string;
      popup: string;
    }
    color: {
      primary: string;
      background: string;
      text: string;
    },
    fontFamily: {
      title: string;
      text: string;
    }
  }
}
