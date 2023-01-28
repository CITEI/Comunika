import React from "react";
import styled from "styled-components";
import { Box, Button, Header, H2 } from "@adminjs/design-system";
import { PageContext } from "adminjs";
import { ApiClient } from "adminjs";
import { json2csv } from "json-2-csv";

const api = new ApiClient();

const Body = styled(Box)`
  width: 100%;
  height: 100%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 1rem;
`;

const data = [
  { code: "CA", name: "California" },
  { code: "TX", name: "Texas" },
  { code: "NY", name: "New York" },
];

interface ExportProps extends PageContext {
  userdata: any;
}

export default function ExportData({ userdata }: ExportProps) {
  const exportJson = async () => {
    const { data } = await api.getPage({
      pageName: "ExportData",
      method: "get",
      params: { type: "json" },
    });

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  const exportCSV = async () => {
    const { data } = await api.getPage({
      pageName: "ExportData",
      method: "get",
      params: { type: "csv" },
    });

    json2csv(data, (err, csv) => {
      if (err) {
        throw err;
      }

      const jsonString = `data:text/csv;chatset=utf-8,${encodeURIComponent(
        csv
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.csv";

      link.click();
    });
  };
  return (
    <Box padding="24px">
      <Header>
        <H2 margin-bottom="32px">Export user data content</H2>
        <H2>{JSON.stringify(userdata)}</H2>
      </Header>
      <Body>
        <Button onClick={exportCSV}>CSV</Button>
        <Button onClick={exportJson}>JSON</Button>
        {/* <Button>XML</Button> */}
      </Body>
    </Box>
  );
}
