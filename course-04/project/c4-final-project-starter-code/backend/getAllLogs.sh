#!/bin/sh

echo "\nAPI"
apiStream=$(aws  logs describe-log-streams --log-group-name /aws/api-gateway/serverless-todo-app-us-west-2-dev --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $apiStream

aws logs get-log-events --log-group-name /aws/api-gateway/serverless-todo-app-us-west-2-dev --log-stream-name $apiStream | grep message | cut -d : -f 2-100 


echo "\nAuth"

authStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-Auth --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',') 
echo $authStream

aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-Auth --log-stream-name $authStream | grep message | cut -d : -f 2-100 
# aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-Auth --log-stream-name $authStream 

echo  "\nGETTodo"
usersStream=$(aws  logs describe-log-streams --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $usersStream

aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --log-stream-name $usersStream | grep message | cut -d : -f 2-100 
# aws logs get-log-events --log-group-name /aws/lambda/serverless-todo-app-us-west-2-dev-GetTodos --log-stream-name $usersStream 

echo  "\n"

date -u
