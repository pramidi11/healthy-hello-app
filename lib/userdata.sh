#!/bin/sh

sudo su
yum update -y
mkdir ~/.aws
cat <<EOT >> ~/.aws/credentials
[default]
role_arn = arn:aws:iam::066266277042:role/HealthyHelloAppStack-ec2roleFD75669B-KW8XCS5BN3I0
credential_source = Ec2InstanceMetadata
region = ap-southeast-2
EOT
yum install -y docker
id ec2-user
newgrp docker
sudo usermod -a -G docker ec2-user
systemctl enable docker.service
systemctl start docker.service
docker run -d -p 80:3000 --log-driver=awslogs --log-opt awslogs-region=ap-southeast-2 --log-opt awslogs-group=helloApp ghcr.io/pramidi11/hello-app:latest
