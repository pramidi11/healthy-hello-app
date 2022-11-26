#!/bin/sh

sudo su
yum update -y
yum install -y docker
systemctl enable docker.service
systemctl start docker.service