

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getGETSignedUrl } from '../lambda/utils'
const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const logger = createLogger('dataLayer')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODO_TABLENAME) {
  }

  async getAllTodoItems(userId: String): Promise<TodoItem[]> {
    const rows =  await this.docClient.query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
      }).promise()

    const items = rows.Items
    for(var i = 0; i < items.length; i++) { 
        const oneItem = items[i]
        if(oneItem.attachmentUrl) {
          oneItem.attachmentUrl = getGETSignedUrl(oneItem.attachmentUrl)
        }
        else {
          oneItem.attachmentUrl = ''
        }
    
        delete oneItem.userId
      }

    return items as TodoItem[]
  }

  async createTodoItem(theItem: TodoItem): Promise<TodoItem> {
    logger.info(`Creating item ${JSON.stringify(theItem)} tableName:${this.todoTable}`)
      const theOutput = await this.docClient.put({
        TableName: this.todoTable,
        Item: theItem
      }).promise()
  
      logger.info(`Creating completed ${JSON.stringify(theOutput)}`)

      return theItem
  }

  async deleteTodoItem(todoId: string, userId: string) {
    logger.info(`Deleting todo item with id ${todoId} for user ${userId}`)
  
    const theItem = await this.getItem(todoId, userId)
    if (!theItem) {
      logger.info(`Todo item ${todoId} not found`);
      return
    }
  
    logger.info(`Found item ${JSON.stringify(theItem)}`)
    var params = {
      TableName : this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    };
  
    await this.docClient.delete(params).promise()
  
    logger.info(`Deleted item ${todoId}`)
  }

  async updateTodoItem(todoId: string, userId: string, updateRequest: UpdateTodoRequest) {
    const theItem = await this.getItem(todoId, userId)
    theItem.done = updateRequest.done
    theItem.name = updateRequest.name
    theItem.dueDate = updateRequest.dueDate
    
    logger.info(theItem)
    await this.docClient.put({TableName: this.todoTable, Item: theItem}).promise()
    
    logger.info(`item ${todoId} updated successfully`)
  }

  async getItem(todoId: string, userId: string) {
    const result = await this.docClient
      .get({
        TableName: this.todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()
  
    
    return result.Item
  }

  async isItemExists(userId: string, todoId: string) : Promise<boolean> {
      const theItem = await this.getItem(todoId, userId)

      return !!theItem
  }
}

