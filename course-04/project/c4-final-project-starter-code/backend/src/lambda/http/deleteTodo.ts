import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('auth')

const headers =  {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

const docClient = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.TODO_TABLENAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  logger.info(`Deleting todo item with id ${todoId} for user ${userId}`)

  const theItem = await getItem(todoId, userId)
  if (!theItem) {
    logger.info(`Todo item ${todoId} not found`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: 'Already deleted'
      }),
      headers: headers
    }
  }

  logger.info(`Found item ${JSON.stringify(theItem)}`)

  var params = {
    TableName : tableName,
    Key: {
      userId: userId,
      todoId: todoId
    }
  };

  await docClient.delete(params).promise()

  logger.info(`Deleted item ${todoId}`)
  
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: 'deleted item'
}
}

async function getItem(todoId: string, userId: string) {
  const result = await docClient
    .get({
      TableName: tableName,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()

  
  return result.Item
}
