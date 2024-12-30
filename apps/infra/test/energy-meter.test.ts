import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { EnergyMeterStack } from "../lib/energy-meter-stack";

it("should match with snapshot", () => {
  const app = new App();
  const stack = new EnergyMeterStack(app, "Stack", {
    email: "test@example.com",
  });
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});
