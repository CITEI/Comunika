import { cleanDb, mockDb, parseRoute } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";
import {
  createLevel,
  LEVEL_GET_ROUTE,
} from "./level.test";
import { Application } from "express";

export const CATEGORY_POST_ROUTE = parseRoute("/category");
export const SUCCESSFUL_CREATE_CATEGORY_BODY = {
  name: "test",
  description: "test",
  iconUrl: "test",
};
export const GET_CATEGORY_ROUTE = LEVEL_GET_ROUTE;

export async function createCategory(
  app: Application,
  level: string
): Promise<Array<string>> {
  await request(app)
    .post(CATEGORY_POST_ROUTE)
    .send({ ...SUCCESSFUL_CREATE_CATEGORY_BODY, level });
  const res = await request(app).get(GET_CATEGORY_ROUTE).send();
  return [].concat(...(res.body as Array<any>).map((el) => el.categories));
}

describe("POST /category", () => {
  let levels: Map<string, any>;

  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
    levels = await createLevel(app);
  });

  test("Successful", () => {
    request(app)
      .post(CATEGORY_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_CATEGORY_BODY)
      .expect(StatusCodes.CREATED);
  });
});

const categoryTaskPostRoute = (category: string) =>
  parseRoute(`/category/${category}/task`);
const SUCCESSFUL_CREATE_CATEGORY_TASK_BODY = {
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

describe("POST /category/task", () => {
  let levels: Map<string, any>;
  let categories: Array<string>;

  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
    levels = await createLevel(app);
    categories = await createCategory(app, levels.keys().next().value);
  });

  test("Successful", async () => {
    request(app)
      .post(categoryTaskPostRoute(categories[0]))
      .send(SUCCESSFUL_CREATE_CATEGORY_TASK_BODY)
      .expect(StatusCodes.CREATED);
  });
});
