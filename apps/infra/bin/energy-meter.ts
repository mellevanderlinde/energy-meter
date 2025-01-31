import { App, Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { EnergyMeterStack } from "../lib/energy-meter-stack";

const app = new App();

new EnergyMeterStack(app, "EnergyMeterStack", {
  env: { region: "eu-west-1" },
  email: app.node.getContext("email"),
});

Aspects.of(app).add(new AwsSolutionsChecks());
