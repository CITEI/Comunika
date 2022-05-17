import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/server";
import { cleanDb, copy, mockDb, parseRoute } from "./utils";
import { expect } from "@jest/globals";

const REGISTER_ROUTE = parseRoute("/auth/register");
const SUCCESSFUL_REGISTER_BODY = {
  name: "test",
  email: "test@test.com",
  password: "12345678",
};

describe("POST /auth/register", () => {
  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  test("Successful", async () => {
    await request(app)
      .post(REGISTER_ROUTE)
      .send(SUCCESSFUL_REGISTER_BODY)
      .expect(StatusCodes.CREATED);
  });

  test("Invalid email", async () => {
    let body = copy(SUCCESSFUL_REGISTER_BODY);
    body["email"] = "test";

    await request(app)
      .post(REGISTER_ROUTE)
      .send(body)
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Invalid password", async () => {
    let body = copy(SUCCESSFUL_REGISTER_BODY);
    body["password"] = "1234567";

    await request(app)
      .post(REGISTER_ROUTE)
      .send(body)
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Missing fields", async () => {
    await expect({
      app,
      method: "post",
      route: REGISTER_ROUTE,
      successfulBody: SUCCESSFUL_REGISTER_BODY,
    }).toBadRequestMissingFields();
  });

  test("Extra fields", async () => {
    await expect({
      app,
      method: "post",
      route: REGISTER_ROUTE,
      successfulBody: SUCCESSFUL_REGISTER_BODY,
    }).toBadRequestExtraFields();
  });

  test("Duplicated", async () => {
    await request(app)
      .post(REGISTER_ROUTE)
      .send(SUCCESSFUL_REGISTER_BODY)
      .expect(StatusCodes.CREATED);

    await request(app)
      .post(REGISTER_ROUTE)
      .send(SUCCESSFUL_REGISTER_BODY)
      .expect(StatusCodes.CONFLICT);
  });
});

const LOGIN_ROUTE = parseRoute("/auth");
const SUCCESSFUL_LOGIN_BODY = {
  email: SUCCESSFUL_REGISTER_BODY.email,
  password: SUCCESSFUL_REGISTER_BODY.password,
};

describe("POST /auth", () => {
  beforeAll(async () => {
    await mockDb();
    await request(app).post(REGISTER_ROUTE).send(SUCCESSFUL_REGISTER_BODY);
  });

  test("Successful", async () => {
    const res = await request(app)
      .post(LOGIN_ROUTE)
      .send(SUCCESSFUL_LOGIN_BODY)
      .expect(StatusCodes.OK);
    expect(res.body).not.toBeNull();
  });

  test("Nonexistent email", async () => {
    let body = copy(SUCCESSFUL_LOGIN_BODY);
    body["email"] = "test";

    await request(app)
      .post(LOGIN_ROUTE)
      .send(body)
      .expect(StatusCodes.NOT_FOUND);
  });

  test("Wrong password", async () => {
    let body = copy(SUCCESSFUL_LOGIN_BODY);
    body["password"] = "1234567";

    await request(app)
      .post(LOGIN_ROUTE)
      .send(body)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  test("Extra fields", async () => {
    await expect({
      app,
      method: "post",
      route: LOGIN_ROUTE,
      successfulBody: SUCCESSFUL_LOGIN_BODY,
    }).toBadRequestExtraFields();
  });

  test("Missing fields", async () => {
    await expect({
      app,
      method: "post",
      route: LOGIN_ROUTE,
      successfulBody: SUCCESSFUL_LOGIN_BODY,
    }).toBadRequestMissingFields();
  });
});
