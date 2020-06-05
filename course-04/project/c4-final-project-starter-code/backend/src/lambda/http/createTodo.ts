import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLENAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  console.log(newTodo)
  console.log('Processing event: ', event)
  
  const parsedBody = JSON.parse(event.body)

  console.log('Parsed event: ', parsedBody)

  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]

  const jwtToken = "todo"
  
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString() 

  const newItem = {
    todoId: itemId,
    userId: getUserId(jwtToken),
    timestamp: timestamp,
    ...parsedBody
  }

  console.log('Storing new item: ', newItem)

  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise()

  console.log('Created item: ', newItem)
  
  const response = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }

  console.log('Response: ', response)

  return response
}

function getUserId(jwtToken: string) {
  return "TODO" + jwtToken
}
