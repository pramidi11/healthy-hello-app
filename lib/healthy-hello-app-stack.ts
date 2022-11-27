import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    UserData,
    Vpc
} from "aws-cdk-lib/aws-ec2";
import {readFileSync} from "fs";
import {ArnPrincipal, Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {FilterPattern, LogGroup, MetricFilter} from "aws-cdk-lib/aws-logs";
import {Alarm, Metric} from "aws-cdk-lib/aws-cloudwatch";


export class HealthyHelloAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

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

        const ec2Role = new Role(this, 'ec2-role', {
            assumedBy:  new ServicePrincipal('ec2.amazonaws.com')

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

        const ec2LogGroup = new LogGroup(this, 'ec2Logs', {
            logGroupName: 'displa'
        })

        const ec2Metric = new MetricFilter(this, 'filter', {
            filterPattern: FilterPattern.anyTerm( 'warn', 'ERROR', 'error', 'WARN'),
            logGroup: ec2LogGroup,
            metricName: "ec2MetricName",
            metricNamespace: "AppErrorNamespace"

        })

        const alarm = new Alarm(this, 'helloAlarm', {
            evaluationPeriods: 5, metric: ec2Metric.metric(), threshold: 5

        })


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
            keyName: 'displa',
            role: ec2Role
        })

    }
}
