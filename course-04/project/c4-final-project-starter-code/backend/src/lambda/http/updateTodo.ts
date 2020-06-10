import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateTodoItem } from '../../businessLogic/todo'

const headers =  {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const result = await updateTodoItem(event)
  if(result) {
    return {
      statusCode: 204,
      headers: headers,
      body: "No content"
    }
  }

  return {
    statusCode: 404,
    headers: headers,
    body: "Not found"
  }
}


