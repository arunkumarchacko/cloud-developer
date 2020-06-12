// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'b3mjst6yd5'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-7107ktyd.auth0.com',            // Auth0 domain
  clientId: 'tuCS2rPIeP3nfkAUPJdS72tGjvwnTfFq',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
