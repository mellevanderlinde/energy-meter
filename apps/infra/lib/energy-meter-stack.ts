import { Duration, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import { ComparisonOperator } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  AnyPrincipal,
  Effect,
  PolicyStatement,
  User,
} from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { NagSuppressions } from "cdk-nag";
import type { Construct } from "constructs";

export class EnergyMeterStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { email: string },
  ) {
    super(scope, id, props);

    const appName = "energy-meter";

    const user = new User(this, "User", { userName: appName });

    const table = new Table(this, "Table", {
      tableName: appName,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "date",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "time",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    NagSuppressions.addResourceSuppressions(table, [
      {
        id: "AwsSolutions-DDB3",
        reason: "This table does not require point-in-time recovery",
      },
    ]);

    user.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [table.tableArn],
      }),
    );

    const topic = new Topic(this, "Topic", {
      topicName: appName,
    });

    topic.addToResourcePolicy(
      new PolicyStatement({
        sid: "AllowPublishThroughSSLOnly",
        actions: ["SNS:Publish"],
        effect: Effect.DENY,
        resources: [topic.topicArn],
        conditions: {
          Bool: {
            "aws:SecureTransport": "false",
          },
        },
        principals: [new AnyPrincipal()],
      }),
    );

    topic.addSubscription(new EmailSubscription(props.email));

    const noWritesAlarm = table
      .metricConsumedWriteCapacityUnits({
        period: Duration.hours(1),
        statistic: "sum",
      })
      .createAlarm(this, "Alarm", {
        alarmName: appName,
        alarmDescription: "No writes to table",
        evaluationPeriods: 1,
        threshold: 0,
        comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      });

    noWritesAlarm.addAlarmAction(new SnsAction(topic));
  }
}
