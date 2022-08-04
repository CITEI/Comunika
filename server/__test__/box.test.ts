import { cleanDb, mockDb, parseRoute } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";
import {
  createModule,
  MODULE_GET_ROUTE,
} from "./module.test";
import { Application } from "express";

export const BOX_POST_ROUTE = parseRoute("/box");
export const SUCCESSFUL_CREATE_BOX_BODY = {
  name: "test",
  description: "test",
  iconUrl: "test",
};
export const GET_BOX_ROUTE = MODULE_GET_ROUTE;

export async function createBox(
  app: Application,
  module: string
): Promise<Array<string>> {
  await request(app)
    .post(BOX_POST_ROUTE)
    .send({ ...SUCCESSFUL_CREATE_BOX_BODY, module });
  const res = await request(app).get(GET_BOX_ROUTE).send();
  return [].concat(...(res.body as Array<any>).map((el) => el.boxes));
}

describe("POST /box", () => {
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
      .post(BOX_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_BOX_BODY)
      .expect(StatusCodes.CREATED);
  });
});

const boxActivityPostRoute = (box: string) =>
  parseRoute(`/box/${box}/activity`);
const SUCCESSFUL_CREATE_BOX_ACTIVITY_BODY = {
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

describe("POST /box/activity", () => {
  let modules: Map<string, any>;
  let boxes: Array<string>;

  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
    modules = await createModule(app);
    boxes = await createBox(app, modules.keys().next().value);
  });

  test("Successful", async () => {
    request(app)
      .post(boxActivityPostRoute(boxes[0]))
      .send(SUCCESSFUL_CREATE_BOX_ACTIVITY_BODY)
      .expect(StatusCodes.CREATED);
  });
});
