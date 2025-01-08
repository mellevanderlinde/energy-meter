import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { StoragePort } from "../ports/storage-port";
import "dotenv/config";

export class DynamodbAdapter implements StoragePort {
  private tableName: string;
  private client: DynamoDBClient;

  constructor(tableName: string, client?: DynamoDBClient) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!(accessKeyId && secretAccessKey)) {
      throw new Error("AWS credentials are missing");
    }

    this.tableName = tableName;
    this.client =
      client ||
      new DynamoDBClient({
        credentials: { accessKeyId, secretAccessKey },
        region: "eu-west-1",
      });
  }

  public save(date: string, time: string, kwh: number): void {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        date: { S: date },
        time: { S: time },
        kwh: { N: kwh.toString() },
      },
    });
    this.client.send(command);
  }
}
