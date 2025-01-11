import { expect, it, vi } from "vitest";
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

it("should save an item", () => {
  const client = { send: vi.fn() };
  const adapter = new DynamodbAdapter("table-name", client as never);

  adapter.save("2025-01-01", "12:00", 1.23);

  expect(client.send).toHaveBeenCalledWith(
    expect.objectContaining({
      input: {
        TableName: "table-name",
        Item: {
          date: { S: "2025-01-01" },
          time: { S: "12:00" },
          kwh: { N: "1.23" },
        },
      },
    }),
  );
});
