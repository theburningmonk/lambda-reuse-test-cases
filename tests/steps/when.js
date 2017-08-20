'use strict';

const APP_ROOT = '../../';

const _       = require('lodash');
const co      = require('co');
const Promise = require("bluebird");
const http    = require('superagent-promise')(require('superagent'), Promise);
const mode    = process.env.TEST_MODE;

let respondFrom = function (httpRes) {
  return { 
    statusCode: httpRes.status,
    body: httpRes.body,
    headers: httpRes.headers
  };
}

let viaHttpGet = co.wrap(function* (relPath) {
  let root = process.env.TEST_ROOT;
  let url = `${root}/${relPath}`;
  console.log(`executing via HTTP GET: ${url}`);

  try {
    let res = yield http.get(url);
    return respondFrom(res);
  } catch (err) {
    if (err.status) {
      return {
        statusCode: err.status,
        headers: err.response.headers
      };
    } else {
      throw err;
    }
  }
});

let viaHandler = (funcName, event) => {
  console.log('executing by invoking handler directly');

  let handler = require(`${APP_ROOT}/functions/${funcName}`).handler; 

  return new Promise((resolve, reject) => {
    let context = {};
    let callback = function (err, response) {
      if (err) {
        reject(err);
      } else {
        let contentType = _.get(response, 'headers.Content-Type', 'application/json');
        if (response.body && contentType === 'application/json') {
          response.body = JSON.parse(response.body);
        }

        resolve(response);
      }
    };

    handler(event, context, callback);
  });
};

let we_invoke_get = co.wrap(function* () {
  let res = 
    mode === 'handler' 
      ? yield viaHandler('get', {})
      : yield viaHttpGet('');

  return res;
});

module.exports = {
  we_invoke_get
};