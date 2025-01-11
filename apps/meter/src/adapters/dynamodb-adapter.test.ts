import { expect, it } from "vitest";
import { DynamodbAdapter } from "./dynamodb-adapter";

it("should throw an error if AWS credentials are missing", () => {
  expect(() => {
    new DynamodbAdapter("table-name");
  }).toThrowError("AWS credentials are missing");

  process.env.AWS_ACCESS_KEY_ID = "access-key-id";
  expect(() => {
    new DynamodbAdapter("table-name");
  }).toThrowError("AWS credentials are missing");

  process.env.AWS_SECRET_ACCESS_KEY = "secret-access-key";
  expect(() => {
    new DynamodbAdapter("table-name");
  }).not.toThrowError();
});
