import 'source-map-support/register'

import { S3Handler, S3CreateEvent} from 'aws-lambda'

// import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODO_TABLENAME

export const handler: S3Handler = async (event: S3CreateEvent) => {
  logger.info(`Received event ${event} ${event.Records.length}`)
  for (const record of event.Records) {
    logger.info(`Processing record ${record.eventName} ${JSON.stringify(record)} `)

    if (record.eventName !== 'ObjectCreated:Put') {
        continue
    }

    logger.info(`object ${JSON.stringify(record.s3.object)} `)
    const itemId = record.s3.object.key

    logger.info(`itemid ${JSON.stringify(itemId)} `)

    const splitted = itemId.split('.')
    const userId = splitted[1]
    const todoId = splitted[2]

    logger.info(`UserId=${userId} TodoId=${todoId}`)

    var params = {
        TableName:tableName,
        Key:{
            userId: userId,
            todoId: todoId
        },
        UpdateExpression: "set attachmentUrl = :r",
        ExpressionAttributeValues:{
            ":r":itemId,
        },
        ReturnValues:"UPDATED_NEW"
    };

    await docClient.update(params).promise()

    logger.info(`${userId} ${todoId} updated with ${itemId}`)
  }
}


// {eventVersion:2.1,
//     eventSource:aws:s3,
//     awsRegion:us-west-2,
//     eventTime:2020-06-07T13:15:58.342Z,
//     eventName:ObjectCreated:Put,
//     userIdentity:{principalId:AWS:AROA5WI4FAM6AN2WXORZ5:serverless-todo-app-us-west-2-dev-GenerateUploadUrl},
//     requestParameters:{sourceIPAddress:49.207.58.147},
//     responseElements:{x-amz-request-id:F8204D44ECF00245,x-amz-id-2:WiR369HnTFwn6YgGV4/fvLnpx3maDxNtnBvUxTGgM6FnfGwgIgW1Ch1KT9fpl844Zc+E0Cl/rVgCvcI10rCBg4PoSCeKRZzs},
//     s3:
//     {
//         s3SchemaVersion:1.0,
//         configurationId:serverless-todo-app-us-west-2-dev-ImpageUploadHandler-68a737133cefb25bff959852b8f04754,
//         bucket:{name:ud-cdnd-arun1-dev,ownerIdentity:{principalId:AYYIWQEDJ8VU1},arn:arn:aws:s3:::ud-cdnd-arun1-dev},
//         object:{key:att.a3b3cc84dcede3851d6d255ca20ca180.301af5fa-ea88-4396-9278-69434bd3f348.png,size:241988,eTag:b7b54bfb7c0a690daee3dcfe0fd4314b,sequencer:005EDCE8912DCEDA0C}}
    
//     }
