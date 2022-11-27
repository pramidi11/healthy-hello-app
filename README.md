[![build and deploy app](https://github.com/pramidi11/healthy-hello-app/actions/workflows/deploy-workflow.yml/badge.svg)](https://github.com/pramidi11/healthy-hello-app/actions/workflows/deploy-workflow.yml)


# health-hellow-app

This is simple application to demo 
1. simple page web application serving hello world with nodejs
2. CDK to deploy infrastructure as code on AWS
3. Deploy node application in docker on direct ec2 host
4. Monitor ec2/application health with cloudwatch alarm

#Architecture
[!img.png](src/img.png)
# Stack
1. Creates VPC from scratch with default configs
2. EC2 machine with docker installed and deploying on subnet.
3. awslog driver to forward logs to cloudwatch
4. Cloudwatch logs to collect logs
5. Cloudwatch alarm to alert in case application logs are warn/error
6. security group to add firewall to control access of ec2. TCP 80/22 is open to internet and can be controlled


#Local Setuptools
1. CDK
2. Docker
3. AWS credentials
4. Node
5. Git
6. Github for code repository/actions/docker images

#CI
GitHub actions 
1. Runs CI on every commit 
2. Auto deploy application/ec2 on every merge to main

#Tests
`npm test` (Tests are not added in this repository)

#Deploying from local
1. Authenticate your local machine to AWS
2. run `AWS_ACCOUNT=${{ inputs.account }} npx cdk deploy --require-approval never`

#Running application locally
1. `cd src` and `npm run start`
2. docker
   1. `cd src`
   2. `docker build -t ghcr.io/pramidi11/hello-app:latest .`
   3. `docker run -d -p 80:3000 --log-driver=awslogs --log-opt awslogs-region=ap-southeast-2 --log-opt awslogs-group=helloApp ghcr.io/pramidi11/hello-app:latest`

#Ways to deploy/monitor applicatin
1. Cloudwatch alarm monitors cloud watch logs and alerts slack/email via sns in case of Error/.Warning logs
2. App can be deployed into ECS/EKS when container/pod is unhealth it is recovered automatically
3. Load balancer monitors endpoint health and replaces the ec2 incase of unhealthy

Health checks can be done through DATADOG synthentics aws-native solution is not scoped.

If app can be serverless, APIGATEWAY and LAMBDA can be best solution that scales and runs reliably. 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
