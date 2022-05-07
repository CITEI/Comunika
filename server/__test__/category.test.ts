import { cleanDb, mockDb, parseRoute } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";

const POST_CATEGORY_ROUTE = parseRoute("/category");
const SUCCESSFUL_CATEGORY_BODY = {
  name: "test",
  description: "test",
  iconUrl: "test",
  level: null,
};

describe("POST /category", () => {
  beforeAll(async () => {
    await mockDb();
  });

  beforeEach(async () => {
    await cleanDb();
  });

  test("Successful", () => {
    request(app)
      .post(POST_CATEGORY_ROUTE)
      .send(SUCCESSFUL_CATEGORY_BODY)
      .expect(StatusCodes.CREATED);
  });

  test("Missing fields", () => {});
});
