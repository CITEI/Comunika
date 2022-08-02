import { mockDb, parseRoute, cleanDb, generateFakeMongoUUID } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";
import { expect } from "@jest/globals";
import { Application } from "express";

export const STAGE_POST_ROUTE = parseRoute("/stage");
export const SUCCESSFUL_CREATE_STAGE_BODY = { name: "test" };
export const STAGE_GET_ROUTE = parseRoute("/stage");

export async function createStage(app: Application): Promise<Map<string, any>> {
  await request(app).post(STAGE_POST_ROUTE).send(SUCCESSFUL_CREATE_STAGE_BODY);
  const res = await request(app).get(STAGE_GET_ROUTE).send();
  return new Map((res.body as Array<any>).map((el) => [el._id, el]));
}

describe("POST /stage", () => {
  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  test("Successful", async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_STAGE_BODY)
      .expect(StatusCodes.CREATED);
  });

  test("Extra fields", async () => {
    await expect({
      app,
      method: "post",
      route: STAGE_POST_ROUTE,
      successfulBody: SUCCESSFUL_CREATE_STAGE_BODY,
    }).toBadRequestExtraFields();
  });

  test("Missing fields", async () => {
    await expect({
      app,
      method: "post",
      route: STAGE_POST_ROUTE,
      successfulBody: SUCCESSFUL_CREATE_STAGE_BODY,
    }).toBadRequestMissingFields();
  });

  test("Invalid name", async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "t" })
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe("GET /stage", () => {
  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  test("Successful", async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_STAGE_BODY);
    await request(app)
      .get(STAGE_GET_ROUTE)
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body).toHaveLength(1);
      });
  });

  test("Successful empty", async () => {
    await request(app)
      .get(STAGE_GET_ROUTE)
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body).toHaveLength(0);
      });
  });
});

const stageNextRoute = (id: string): string => parseRoute(`/stage/${id}/next`);

describe("GET /stage/:id/next", () => {
  let ids: Map<string, string>;

  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "first" });

    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "second" });

    ids = new Map<string, string>(
      ((await request(app).get(STAGE_GET_ROUTE).send()).body as Array<any>).map(
        (lvl) => [lvl.name, lvl._id]
      )
    );
  });

  test("Successful", async () => {
    await request(app)
      .get(stageNextRoute(ids.get("first")!))
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) =>
        expect(res.body._id).toEqual(ids.get("second"))
      );
  });

  test("Successful last", async () => {
    await request(app)
      .get(stageNextRoute(ids.get("second")!))
      .send()
      .expect(StatusCodes.NO_CONTENT);
  });

  test("Invalid id", async () => {
    await request(app)
      .get(stageNextRoute("not-an-id"))
      .send()
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Inexistent id", async () => {
    await request(app)
      .get(stageNextRoute(generateFakeMongoUUID()))
      .send()
      .expect(StatusCodes.NOT_FOUND);
  });
});

const stageDeleteRoute = (id: string) => parseRoute(`/stage/${id}`);

describe("DELETE /stage", () => {
  let id: string;

  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "test" });
    id = (await request(app).get(STAGE_GET_ROUTE).send()).body[0]._id;
  });

  test("Successful", async () => {
    await request(app)
      .delete(stageDeleteRoute(id))
      .send()
      .expect(StatusCodes.OK);
    // No docs are present
    await request(app).get(STAGE_GET_ROUTE).send().expect([]);
  });

  test("Inexistent stage", async () => {
    await request(app)
      .delete(stageDeleteRoute(generateFakeMongoUUID()))
      .send()
      .expect(StatusCodes.NOT_FOUND);
  });

  test("With list reference", async () => {
    // Creating a new document
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "next" });

    // Getting documents
    let docs = (await request(app).get(STAGE_GET_ROUTE).send()).body;

    // Getting the new id
    const nextId = id == docs[0]._id ? docs[1]._id : docs[0]._id;

    // Deleting the new document
    await request(app)
      .delete(stageDeleteRoute(nextId))
      .send()
      .expect(StatusCodes.OK);

    // Checking if its reference was deleted
    await request(app)
      .get(stageNextRoute(id))
      .send()
      .expect(StatusCodes.NO_CONTENT);
  });
});

const STAGE_SWAP_ROUTE = parseRoute("/stage/swap");

describe("PUT /stage/swap", () => {
  let ids: Map<string, string>;
  const getSuccessfulBody = () => ({ from: ids.get("BB"), to: ids.get("DD") });

  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "AA" });
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "BB" });
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "CC" });
    await request(app)
      .post(STAGE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_STAGE_BODY, name: "DD" });
    ids = new Map<string, string>(
      ((await request(app).get(STAGE_GET_ROUTE).send()).body as Array<any>).map(
        (lvl) => [lvl.name, lvl._id]
      )
    );
  });

  test("Successful A->B->C->D : B->A->C->D : A<->B", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("AA"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("AA"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));
  });

  test("Successful A->B->C->D : B->A->C->D : B<->A", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("AA") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("AA"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));
  });

  test("Successful A->B->C->D : A->D->C->B : B<->D", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("DD") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->D->C->B : D<->B", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("DD"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->C->B->D : B<->C", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("CC") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->C->B->D : C<->B", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("CC"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(stageNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Invalid from", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: "invalid", to: ids.get("AA") })
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Invalid to", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: ids.get("AA"), to: "invalid" })
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Inexistent from", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ from: generateFakeMongoUUID(), to: ids.get("AA") })
      .expect(StatusCodes.NOT_FOUND);
  });

  test("Inexistent to", async () => {
    await request(app)
      .put(STAGE_SWAP_ROUTE)
      .send({ to: generateFakeMongoUUID(), from: ids.get("AA") })
      .expect(StatusCodes.NOT_FOUND);
  });

  test("Extra fields", async () => {
    await expect({
      app,
      route: STAGE_SWAP_ROUTE,
      method: "put",
      successfulBody: getSuccessfulBody(),
    }).toBadRequestExtraFields();
  });

  test("Extra fields", async () => {
    await expect({
      app,
      route: STAGE_SWAP_ROUTE,
      method: "put",
      successfulBody: getSuccessfulBody(),
    }).toBadRequestMissingFields();
  });
});
