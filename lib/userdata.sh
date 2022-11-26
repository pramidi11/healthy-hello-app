#!/bin/sh

sudo su
yum update -y
yum install -y docker
id ec2-user
newgrp docker
sudo usermod -a -G docker ec2-user
systemctl enable docker.service
systemctl start docker.service
docker run -d -p 8000:3000 ghcr.io/pramidi11/hello-app:latest