const APP_ROOT = '../../'

const _       = require('lodash')
const Promise = require("bluebird")
const http    = require('superagent-promise')(require('superagent'), Promise)
const mode    = process.env.TEST_MODE

const respondFrom = function (httpRes) {
  return { 
    statusCode: httpRes.status,
    body: httpRes.body,
    headers: httpRes.headers
  }
}

const viaHttpGet = async (relPath) => {
  const root = process.env.TEST_ROOT;
  const url = `${root}/${relPath}`;
  console.log(`executing via HTTP GET: ${url}`)

  try {
    const res = await http.get(url)
    return respondFrom(res)
  } catch (err) {
    if (err.status) {
      return {
        statusCode: err.status,
        headers: err.response.headers
      }
    } else {
      throw err
    }
  }
}

const viaHandler = async (funcName, event) => {
  console.log('executing by invoking handler directly')

  const handler = require(`${APP_ROOT}/functions/${funcName}`).handler
  const response = await handler(event, {})
  const contentType = _.get(response, 'headers.Content-Type', 'application/json')
  if (response.body && contentType === 'application/json') {
    response.body = JSON.parse(response.body);
  }

  return response
}

const we_invoke_get = async () => {
  let res = 
    mode === 'handler' 
      ? await viaHandler('get', {})
      : await viaHttpGet('')

  return res
}

module.exports = {
  we_invoke_get
}