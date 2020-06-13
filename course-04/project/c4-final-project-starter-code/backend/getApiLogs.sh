#!/bin/sh

logStream=$(aws  logs describe-log-streams --log-group-name /aws/api-gateway/arun-todoapp-dev --order-by LastEventTime | grep arn | tail -1 | cut -d : -f10 | tr -d '"' | tr -d ',')
echo $logStream

aws logs get-log-events --log-group-name /aws/api-gateway/arun-todoapp-dev --log-stream-name $logStream | grep message | cut -d : -f 2-100 