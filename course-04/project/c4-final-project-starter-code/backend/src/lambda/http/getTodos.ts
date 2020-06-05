import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

const tableName = process.env.TODO_TABLENAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log("Getting todo items:" + event)
  const result = await docClient.scan({
    TableName: tableName
  }).promise()

  const items = result.Items

  // TODO: Filter for a user
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
