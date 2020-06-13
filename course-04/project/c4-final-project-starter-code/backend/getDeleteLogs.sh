#!/bin/sh

echo  "\nDeleteTodo"
deleteStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-DeleteTodo --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $deleteStream

aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-DeleteTodo --log-stream-name $deleteStream | grep message | cut -d : -f 2-100 
# aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --log-stream-name $usersStream 

echo  "\n"

date -u