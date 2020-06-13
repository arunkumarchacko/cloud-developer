#!/bin/sh

# logStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-Auth --order-by LastEventTime | grep arn | tail -1 | cut -d'"' -f 4)

logStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/arun-todoapp-dev-Auth --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $logStream

aws logs get-log-events --log-group-name /aws/lambda/arun-todoapp-dev-Auth --log-stream-name $logStream | grep message | cut -d : -f 2-100 

date -u