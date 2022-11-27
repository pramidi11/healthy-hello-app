import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import {HelloBelong} from "../lib/hello-belong";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/healthy-hello-app-stack.ts
test('Stack is created with resources', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new HelloBelong(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.resourcePropertiesCountIs("AWS::EC2::VPC", {
    "CidrBlock": "10.0.0.0/16"
  }, 1)

  template.resourcePropertiesCountIs("AWS::EC2::NatGateway", {}, 1)
  template.hasResourceProperties("AWS::EC2::Instance", {"InstanceType": "t2.micro",})
});
