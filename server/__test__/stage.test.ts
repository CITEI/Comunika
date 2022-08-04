import { cleanDb, mockDb, parseRoute } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";
import {
  createModule,
  MODULE_GET_ROUTE,
} from "./module.test";
import { Application } from "express";

export const STAGE_POST_ROUTE = parseRoute("/stage");
export const SUCCESSFUL_CREATE_STAGE_BODY = {
  name: "test",
  description: "test",
  iconUrl: "test",
};
export const GET_STAGE_ROUTE = MODULE_GET_ROUTE;

export async function createStage(
  app: Application,
  module: string
): Promise<Array<string>> {
  await request(app)
    .post(STAGE_POST_ROUTE)
    .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, module });
  const res = await request(app).get(GET_STAGE_ROUTE).send();
  return [].concat(...(res.body as Array<any>).map((el) => el.stagees));
}

describe("POST /stage", () => {
  let modules: Map<string, any>;

  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
    modules = await createModule(app);
  });

  test("Successful", () => {
    request(app)
      .post(STAGE_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_STAGE_BODY)
      .expect(StatusCodes.CREATED);
  });
});

const stageActivityPostRoute = (stage: string) =>
  parseRoute(`/stage/${stage}/activity`);
const SUCCESSFUL_CREATE_STAGE_ACTIVITY_BODY = {
  name: "test",
  description: "test",
  nodes: [
    {
      type: "text",
      title: "test",
      text: "test",
    },
  ],
  questionNodes: [
    {
      title: "test",
      question: "test?",
    },
  ],
};

describe("POST /stage/activity", () => {
  let modules: Map<string, any>;
  let stagees: Array<string>;

  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
    modules = await createModule(app);
    stagees = await createStage(app, modules.keys().next().value);
  });

  test("Successful", async () => {
    request(app)
      .post(stageActivityPostRoute(stagees[0]))
      .send(SUCCESSFUL_CREATE_STAGE_ACTIVITY_BODY)
      .expect(StatusCodes.CREATED);
  });
});
