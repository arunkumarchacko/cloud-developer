import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodoItem } from '../../businessLogic/todo'

const headers =  {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await deleteTodoItem(event)
  
  return {
    statusCode: 200,
    headers: headers,
    body: 'deleted item'
  }
}

