import { App } from "aws-cdk-lib";
import { EnergyMeterStack } from "../lib/energy-meter-stack";

const app = new App();

new EnergyMeterStack(app, "EnergyMeterStack", {
  env: { region: "eu-west-1" },
  email: app.node.getContext("email"),
});
