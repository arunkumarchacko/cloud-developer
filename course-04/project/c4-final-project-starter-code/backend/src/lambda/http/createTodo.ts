import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
// import { decode } from 'jsonwebtoken'
// import { Jwt } from '../../auth/Jwt'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('auth')



const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLENAME
// const logsTable = "logsa"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const newTodo: CreateTodoRequest = JSON.parse(event.body)
// newTodo.
  // console.log(newTodo)
  // console.log('Processing event: ', event)
  
  const parsedBody = JSON.parse(event.body)

  // console.log('Parsed event: ', parsedBody)

  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]

  
  // log('create Authheaders:' + authorization)
  // log(`create: ${JSON.stringify(event.headers)}`)
  // log(`principal: ${event.headers.principalId}`)
  // const jwtToken = "todo"
  
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString() 

  const newItem = {
    todoId: itemId,
    userId: getUserId(event),
    timestamp: timestamp,
    ...parsedBody
  }

  logger.info(`Creating todo item: ${JSON.stringify(newItem)}`)

  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise()

  // console.log('Created item: ', newItem)

  logger.info(`Created item`)
  
  // log('Created')
  const response = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }

  // console.log('Response: ', response)

  return response
}

// function getUserId(jwtToken: string) {
//   const jwt: Jwt = decode(jwtToken, { complete: true }) as Jwt
//   console.log(jwt)
//   // log(`payload ${jwt.payload}`)
//   // log(`payload ${jwt.payload.sub}`)
//   // log(`header ${jwt.header}`)
//   return jwt.payload.sub
// }

// async function verifyToken(token: string): Promise<JwtPayload> {
  
//   const jwt: Jwt = decode(token, { complete: true }) as Jwt
//   console.log(jwt)
//   log(`payload ${jwt.payload}`)
//   log(`payload ${jwt.payload.sub}`)
//   log(`header ${jwt.header}`)
//   return jwt.payload.

//   // TODO: Implement token verification
//   // You should implement it similarly to how it was implemented for the exercise for the lesson 5
//   // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
//   // return undefined
// }


// async function log(logMessage: string) {
//   const itemId = uuid.v4()
//   const timestamp = new Date().toISOString() 

//   const newItem = {
//     logid: itemId,
//     timestamp: timestamp,
//     message: logMessage
//   }

//   await docClient.put({
//     TableName: logsTable,
//     Item: newItem
//   }).promise()

// }

