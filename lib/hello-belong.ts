import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    CfnKeyPair,
    CfnRouteTable,
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    NatProvider, Peer, Port,
    SecurityGroup,
    SubnetType,
    UserData,
    Vpc
} from "aws-cdk-lib/aws-ec2";
import {readFileSync} from "fs";
import {Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {FilterPattern, LogGroup, MetricFilter} from "aws-cdk-lib/aws-logs";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";


export class HelloBelong extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);


        const natProvider = NatProvider.gateway()

        const vpc = new Vpc(this, 'default', {
            natGateways: 1,
            natGatewayProvider: natProvider,
            subnetConfiguration: [
                {
                    name: 'PrivateSubnet',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24
                },
                {
                    name: 'PublicSubnets',
                    subnetType: SubnetType.PUBLIC,
                    cidrMask: 24
                },
            ]
        })

        const sg = new SecurityGroup(this, 'sg', {
            securityGroupName: 'webSg',
            vpc: vpc,
        })


        const userDataScript = readFileSync('./lib/userdata.sh', 'utf8');

        const ec2Role = new Role(this, 'ec2-role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
            roleName: 'hello-belong-server'
        })

        ec2Role.addToPolicy(new PolicyStatement({
            resources: ['arn:aws:logs:*:*:*'],
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams'
            ],
            effect: Effect.ALLOW
        }))

        try {
            const ec2LogGroup = new LogGroup(this, 'ec2Logs', {
                logGroupName: "helloBelong",
                removalPolicy: RemovalPolicy.DESTROY
            })
            const ec2Metric = new MetricFilter(this, 'filter', {
                filterPattern: FilterPattern.anyTerm('warn', 'ERROR', 'error', 'WARN'),
                logGroup: ec2LogGroup,
                metricName: "ec2MetricName",
                metricNamespace: "AppErrorNamespace"
            })
            const alarm = new Alarm(this, 'helloAlarm', {
                evaluationPeriods: 5, metric: ec2Metric.metric(), threshold: 5

            })
        } catch (e) {
            console.log(`${e}`)
        }

        const kp = new CfnKeyPair(this, 'ec2KP', {
            keyName: "ec2Kp"

        })

        // create a route table
        const routeTable = new CfnRouteTable(this, "route-table-1", {
            vpcId: vpc.vpcId,
        });

        const webServer = new Instance(this, 'ec2Web', {
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage: MachineImage.genericLinux({
                'ap-southeast-2': 'ami-06bb074d1e196d0d4'
            }),
            vpc: vpc,
            vpcSubnets: vpc.selectSubnets({
                subnetType: SubnetType.PRIVATE_WITH_EGRESS
            }),
            userData: UserData.forLinux({
                shebang: userDataScript
            }),
            securityGroup: sg,
            keyName: kp.keyName,
            role: ec2Role
        })

    }
}
