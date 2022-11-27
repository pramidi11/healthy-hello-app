#!/bin/sh

sudo su
yum update -y
mkdir ~/.aws
cat <<EOT >> ~/.aws/credentials
[default]
role_arn = arn:aws:iam::066266277042:role/belong-hello
credential_source = Ec2InstanceMetadata
region = ap-southeast-2
EOT
yum install -y httpd
systemctl start httpd
systemctl enable httpd
usermod -a -G apache ec2-user
chown -R ec2-user:apache /var/www
chmod 2775 /var/www
find /var/www -type d -exec sudo chmod 2775 {} \;
find /var/www -type f -exec sudo chmod 0664 {} \;
cd /var/www/html
aws s3 cp s3://belong-coding-challenge/belong-test.html .


