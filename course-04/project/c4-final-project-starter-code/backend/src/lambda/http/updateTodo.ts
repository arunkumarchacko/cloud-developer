import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'
import { getUserId, getTodoItem } from '../utils'
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

  logger.info(`Updating item ${todoId} for user ${userId}`)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const theItem = await getTodoItem(todoId, userId)
  theItem.done = updatedTodo.done
  theItem.name = updatedTodo.name
  theItem.dueDate = updatedTodo.dueDate
  
  logger.info(theItem)
  await docClient.put({TableName: tableName, Item: theItem}).promise()
  
  logger.info(`item ${todoId} updated successfully`)

  return {
    statusCode: 204,
    headers: headers,
    body: "No content"
  }
}


