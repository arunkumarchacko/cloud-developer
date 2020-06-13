#!/bin/sh

logStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $logStream

aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --log-stream-name $logStream | grep message | cut -d : -f 2-100 