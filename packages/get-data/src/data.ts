"use server";

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getMockData } from "./data.mock";
import { getDates } from "./dates";
import { sortData } from "./sort";
import type { GetDataOutput } from "./types";

const client = new DynamoDBClient({ region: "eu-west-1" });

export async function getData(numberOfDays: number): Promise<GetDataOutput> {
  const data: GetDataOutput = [];
  const dates = getDates(numberOfDays);

  if (process.env.MOCK_DATA === "true") {
    console.log("Using mock data");
    return getMockData(numberOfDays, data);
  }

  await Promise.all(
    dates.map(async (date) => {
      const command = new QueryCommand({
        TableName: "energy-meter",
        KeyConditionExpression: "#date = :date",
        ExpressionAttributeNames: {
          "#date": "date",
        },
        ExpressionAttributeValues: {
          ":date": { S: date },
        },
      });

      const { Items, LastEvaluatedKey } = await client.send(command);

      if (LastEvaluatedKey) {
        throw new Error("Pagination is currently not implemented");
      }

      for (const item of Items || []) {
        data.push(unmarshall(item));
      }
    }),
  );

  return sortData(data);
}
