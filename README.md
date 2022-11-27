
# belong-hello-app

This is simple application to demo 
1. simple page web application serving hello world with nodejs
2. CDK to deploy infrastructure as code on AWS
3. Monitor ec2/application health with cloudwatch alarm
4. Tests infrastructure code

#Architecture
[!img.png](src/img.png)
# Stack
1. Creates VPC from scratch with default configs
2. EC2 machine with user data script
3. awslog driver to forward logs to cloudwatch
4. Cloudwatch logs to collect logs
5. Cloudwatch alarm to alert in case application logs are warn/error
6. security group to add firewall to control access of ec2. TCP 80/22 is open to internet and can be controlled


#Local Setuptools
1. CDK
2. AWS credentials
3. Node
4. Git
5. Github for code repository/actions/docker images

#CI
GitHub actions 
1. Runs CI on every commit 
2. Auto deploy application/ec2 on every merge to main

#Tests
`npm test` 

#Deploying from local
1. Authenticate your local machine to AWS
2. run `AWS_ACCOUNT=${{ inputs.account }} npx cdk deploy --require-approval never`

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
