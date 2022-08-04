import { mockDb, parseRoute, cleanDb, generateFakeMongoUUID } from "./utils";
import request from "supertest";
import app from "../src/server";
import { StatusCodes } from "http-status-codes";
import { expect } from "@jest/globals";
import { Application } from "express";

export const MODULE_POST_ROUTE = parseRoute("/module");
export const SUCCESSFUL_CREATE_MODULE_BODY = { name: "test" };
export const MODULE_GET_ROUTE = parseRoute("/module");

export async function createModule(app: Application): Promise<Map<string, any>> {
  await request(app).post(MODULE_POST_ROUTE).send(SUCCESSFUL_CREATE_MODULE_BODY);
  const res = await request(app).get(MODULE_GET_ROUTE).send();
  return new Map((res.body as Array<any>).map((el) => [el._id, el]));
}

describe("POST /module", () => {
  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  test("Successful", async () => {
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_MODULE_BODY)
      .expect(StatusCodes.CREATED);
  });

  test("Extra fields", async () => {
    await expect({
      app,
      method: "post",
      route: MODULE_POST_ROUTE,
      successfulBody: SUCCESSFUL_CREATE_MODULE_BODY,
    }).toBadRequestExtraFields();
  });

  test("Missing fields", async () => {
    await expect({
      app,
      method: "post",
      route: MODULE_POST_ROUTE,
      successfulBody: SUCCESSFUL_CREATE_MODULE_BODY,
    }).toBadRequestMissingFields();
  });

  test("Invalid name", async () => {
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "t" })
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe("GET /module", () => {
  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  test("Successful", async () => {
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send(SUCCESSFUL_CREATE_MODULE_BODY);
    await request(app)
      .get(MODULE_GET_ROUTE)
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body).toHaveLength(1);
      });
  });

  test("Successful empty", async () => {
    await request(app)
      .get(MODULE_GET_ROUTE)
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) => {
        expect(res.body).toHaveLength(0);
      });
  });
});

const moduleNextRoute = (id: string): string => parseRoute(`/module/${id}/next`);

describe("GET /module/:id/next", () => {
  let ids: Map<string, string>;

  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "first" });

    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "second" });

    ids = new Map<string, string>(
      ((await request(app).get(MODULE_GET_ROUTE).send()).body as Array<any>).map(
        (lvl) => [lvl.name, lvl._id]
      )
    );
  });

  test("Successful", async () => {
    await request(app)
      .get(moduleNextRoute(ids.get("first")!))
      .send()
      .expect(StatusCodes.OK)
      .expect((res: request.Response) =>
        expect(res.body._id).toEqual(ids.get("second"))
      );
  });

  test("Successful last", async () => {
    await request(app)
      .get(moduleNextRoute(ids.get("second")!))
      .send()
      .expect(StatusCodes.NO_CONTENT);
  });

  test("Invalid id", async () => {
    await request(app)
      .get(moduleNextRoute("not-an-id"))
      .send()
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Inexistent id", async () => {
    await request(app)
      .get(moduleNextRoute(generateFakeMongoUUID()))
      .send()
      .expect(StatusCodes.NOT_FOUND);
  });
});

const moduleDeleteRoute = (id: string) => parseRoute(`/module/${id}`);

describe("DELETE /module", () => {
  let id: string;

  beforeAll(async () => {
    await mockDb();
  });

  afterEach(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "test" });
    id = (await request(app).get(MODULE_GET_ROUTE).send()).body[0]._id;
  });

  test("Successful", async () => {
    await request(app)
      .delete(moduleDeleteRoute(id))
      .send()
      .expect(StatusCodes.OK);
    // No docs are present
    await request(app).get(MODULE_GET_ROUTE).send().expect([]);
  });

  test("Inexistent module", async () => {
    await request(app)
      .delete(moduleDeleteRoute(generateFakeMongoUUID()))
      .send()
      .expect(StatusCodes.NOT_FOUND);
  });

  test("With list reference", async () => {
    // Creating a new document
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "next" });

    // Getting documents
    let docs = (await request(app).get(MODULE_GET_ROUTE).send()).body;

    // Getting the new id
    const nextId = id == docs[0]._id ? docs[1]._id : docs[0]._id;

    // Deleting the new document
    await request(app)
      .delete(moduleDeleteRoute(nextId))
      .send()
      .expect(StatusCodes.OK);

    // Checking if its reference was deleted
    await request(app)
      .get(moduleNextRoute(id))
      .send()
      .expect(StatusCodes.NO_CONTENT);
  });
});

const MODULE_SWAP_ROUTE = parseRoute("/module/swap");

describe("PUT /module/swap", () => {
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
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "AA" });
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "BB" });
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "CC" });
    await request(app)
      .post(MODULE_POST_ROUTE)
      .send({ ...SUCCESSFUL_CREATE_MODULE_BODY, name: "DD" });
    ids = new Map<string, string>(
      ((await request(app).get(MODULE_GET_ROUTE).send()).body as Array<any>).map(
        (lvl) => [lvl.name, lvl._id]
      )
    );
  });

  test("Successful A->B->C->D : B->A->C->D : A<->B", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("AA"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("AA"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));
  });

  test("Successful A->B->C->D : B->A->C->D : B<->A", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("AA") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("AA"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));
  });

  test("Successful A->B->C->D : A->D->C->B : B<->D", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("DD") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->D->C->B : D<->B", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("DD"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->C->B->D : B<->C", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("BB"), to: ids.get("CC") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Successful A->B->C->D : A->C->B->D : C<->B", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("CC"), to: ids.get("BB") })
      .expect(StatusCodes.OK);

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("AA")!))
          .send()
      ).body._id
    ).toEqual(ids.get("CC"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("CC")!))
          .send()
      ).body._id
    ).toEqual(ids.get("BB"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("BB")!))
          .send()
      ).body._id
    ).toEqual(ids.get("DD"));

    expect(
      (
        await request(app)
          .get(moduleNextRoute(ids.get("DD")!))
          .send()
      ).body._id
    ).toBeUndefined();
  });

  test("Invalid from", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: "invalid", to: ids.get("AA") })
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Invalid to", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: ids.get("AA"), to: "invalid" })
      .expect(StatusCodes.BAD_REQUEST);
  });

  test("Inexistent from", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ from: generateFakeMongoUUID(), to: ids.get("AA") })
      .expect(StatusCodes.NOT_FOUND);
  });

  test("Inexistent to", async () => {
    await request(app)
      .put(MODULE_SWAP_ROUTE)
      .send({ to: generateFakeMongoUUID(), from: ids.get("AA") })
      .expect(StatusCodes.NOT_FOUND);
  });

  test("Extra fields", async () => {
    await expect({
      app,
      route: MODULE_SWAP_ROUTE,
      method: "put",
      successfulBody: getSuccessfulBody(),
    }).toBadRequestExtraFields();
  });

  test("Extra fields", async () => {
    await expect({
      app,
      route: MODULE_SWAP_ROUTE,
      method: "put",
      successfulBody: getSuccessfulBody(),
    }).toBadRequestMissingFields();
  });
});
