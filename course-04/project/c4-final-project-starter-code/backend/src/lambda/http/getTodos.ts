import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId, getGETSignedUrl } from '../utils'
const logger = createLogger('auth')

const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODO_TABLENAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  logger.info(`Getting todoItems for ${userId}`)

  const result = await docClient.query({
    TableName : tableName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  }).promise()


  const items = result.Items

  for(var i = 0; i<items.length; i++) { 
    const oneItem = items[i]
    if(oneItem.attachmentUrl) {
      oneItem.attachmentUrl = getGETSignedUrl(oneItem.attachmentUrl)
    }
    else {
      oneItem.attachmentUrl = ''
    }

    delete oneItem.userId
  }

  logger.info(`Returning items with size ${items.length}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
