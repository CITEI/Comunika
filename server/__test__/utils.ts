import { expect as jestExpect } from "@jest/globals";
import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { BASE_PATH } from "../src/pre-start/constants";

/**
 * Appends the API prefix to an endpoint suffix
 */
export function parseRoute(endpoint: string): string {
  return `${BASE_PATH}${endpoint}`;
}

/**
 * Copies an object fields to a new object instance
 */
export function copy(obj: object): { [key: string]: any } {
  return Object.assign({}, obj);
}

/**
 * Proxies mongoose to an in-memory server
 */
export async function mockDb() {
  // @ts-ignore
  await mongoose.connect(global.__MONGO_URI__);
}

/**
 * Drops the current database
 */
export async function cleanDb() {
  await mongoose.connection.db.dropDatabase();
}

// Extending jest
//
export type RouteTest = {
  app: Express;
  method: "get" | "post" | "put";
  route: string;
  successfulBody: object;
};

jestExpect.extend({
  /**
   * Checks if an Express app request returns BadRequest when an extra field
   * is provided
   */
  async toBadRequestExtraFields({
    app,
    method,
    route,
    successfulBody,
  }: RouteTest) {
    let body = copy(successfulBody);
    body["__test"] = "__test";

    const res = await request(app)[method](route).send(body);
    const code = res.statusCode;

    if (code == StatusCodes.BAD_REQUEST)
      return {
        message: () => `passed`,
        pass: true,
      };
    else
      return {
        message: () =>
          `expected status code ${StatusCodes.BAD_REQUEST}, received ${code}`,
        pass: false,
      };
  },
  /**
   * Checks if an Express app request returns BadRequest when fields are
   * removed from a request
   */
  async toBadRequestMissingFields({
    app,
    method,
    route,
    successfulBody,
  }: RouteTest) {
    let err_name = "";
    let err_code = 0;
    let passed = true;

    for (const key of Object.keys(successfulBody)) {
      let body = copy(successfulBody);
      delete body[key];
      const res = await request(app)[method](route).send(body);
      passed = passed && res.statusCode == StatusCodes.BAD_REQUEST;
      if (!passed) {
        err_name = key;
        err_code = res.statusCode;
        break;
      }
    }

    if (passed)
      return {
        message: () => "passed",
        pass: true,
      };
    else
      return {
        message: () =>
          `expected status code ${StatusCodes.BAD_REQUEST}` +
          `, received ${err_code} by removing ${err_name}`,
        pass: false,
      };
  },
});

declare module "expect/build/types" {
  export interface Matchers<R, T = unknown> {
    toBadRequestExtraFields(): R;
    toBadRequestMissingFields(): R;
  }
}
