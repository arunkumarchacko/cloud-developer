import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId, getPutSignedUrl } from '../utils'
const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Getting upload URL for called`)
  
  const todoId = event.pathParameters.todoId
  
  const userId = getUserId(event)

  logger.info(`Getting upload URL for ${todoId} ${userId}`)

  const url = getPutSignedUrl(`att.${userId}.${todoId}.png`)
  logger.info(`Returning presigned URL: ${url}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}


