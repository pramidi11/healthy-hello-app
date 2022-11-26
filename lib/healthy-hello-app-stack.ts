import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage, Peer, Port,
  SecurityGroup,
  SubnetType,
  UserData,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import {readFileSync} from "fs";
import {CfnOutput} from "aws-cdk-lib";
import {CfnHealthCheck} from "aws-cdk-lib/aws-route53";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HealthyHelloAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HealthyHelloAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const vpc = Vpc.fromLookup(this, 'default', {
      vpcId: 'vpc-069adbafd4ab6a86a'
    })

    const sg = new SecurityGroup(this, 'sg', {
      securityGroupName: 'webSg',
      vpc: vpc,
    })

    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'ssh from anywhere')
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'http from anywhere')

    const userDataScript = readFileSync('./lib/userdata.sh', 'utf8');


    const webServer = new Instance(this, 'ec2Web', {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.genericLinux({
        'ap-southeast-2': 'ami-06bb074d1e196d0d4'
      }),
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC
      }),
      userData: UserData.forLinux({
        shebang: userDataScript
      }),
      securityGroup: sg,
      keyName: 'displa'
    })

    const healthCheck = new CfnHealthCheck(this, 'myec2HealthCheck', {
      healthCheckConfig: {
        type: 'ec2',
        alarmIdentifier: {
          name: 'hello',
          region: 'ap-southeast-2'
        },
        ipAddress: webServer.instancePublicIp,
        port: 80,
        measureLatency: false,
        requestInterval: 60
      }

    })
  }
}
