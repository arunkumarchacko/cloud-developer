
// const winston = require('winston');
// const { DynamoDB } = require('winston-dynamodb');

import * as winston from 'winston'
// import {DynamoDB} from 'winston-dynamodb'

// const { DynamoDB } = require('winston-dynamodb');

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
    defaultMeta: { name: loggerName },
    transports: [
      new (winston.transports.Console)()
      // new winston.transports.Console(),
      // new DynamoDB({useEnvironment: true,tableName: process.env.LOGS_TABLENAME})
    ]
  })
}

// const winston = require('winston');
// const { DynamoDB } = require('winston-dynamodb');

// logger.add(new DynamoDB(options));