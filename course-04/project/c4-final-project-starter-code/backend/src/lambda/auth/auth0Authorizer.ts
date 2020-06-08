import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify, decode } from 'jsonwebtoken'
import { decode } from 'jsonwebtoken'
// import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'



// import { logToDDb } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')




// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-7107ktyd.auth0.com/.well-known/jwks.json'

// const jwksClient = require('jwks-rsa');

// const client = jwksClient({
//   jwksUri: jwksUrl
// });

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  // await logToDDb("Auth handler called")
  logger.info('AuthHandler called1', {authToken: event.authorizationToken})

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    // const jwtToken = 'user'
    logger.info('User was authorized', jwtToken)

    return {
      // principalId: jwtToken.sub,
      principalId: "todo",
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

// function getKey(header, callback){
//   client.getSigningKey(header.kid, function(err, key) {
//     var signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// }

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  // await logToDDb("verifyToken")
  const token = getToken(authHeader)
  // await logToDDb(`got token ${token}`)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  // await logToDDb(`decoded token ${jwt}`)
  console.log(jwt)

  const kid = jwt.header.kid;

  logger.info(`KID is ${kid}`)

  
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return undefined
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
