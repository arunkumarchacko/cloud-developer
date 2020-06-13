#!/bin/sh

echo  "\nCreateTodo"
createStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-CreateTodo --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $usersStream

aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-CreateTodo --log-stream-name $createStream | grep message | cut -d : -f 2-100 
# aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --log-stream-name $usersStream 

echo  "\n"

date -u