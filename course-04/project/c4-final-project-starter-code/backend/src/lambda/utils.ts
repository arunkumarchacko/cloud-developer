import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import * as AWS  from 'aws-sdk'
import * as crypto from "crypto";

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLENAME
const s3BucketName = process.env.TODOITEMS_S3_BUCKET

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: process.env.S3REGION,
  params: {Bucket: s3BucketName}
});

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return md5(parseUserId(jwtToken))
}

export async function getTodoItem(todoId: string, userId: string) {
  const result = await docClient
    .get({
      TableName: todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()

  return result.Item
}

export function getPutSignedUrl( key: string ): string{
  const url = s3.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: key,
      Expires: 300
    });

  return url;
}

export function getGETSignedUrl( key: string ): string{
  const url = s3.getSignedUrl('getObject', {
      Bucket: s3BucketName,
      Key: key,
      Expires: 300
    });

  return url;
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}