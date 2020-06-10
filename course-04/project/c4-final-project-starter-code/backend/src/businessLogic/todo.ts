// import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest} from '../requests/CreateTodoRequest'
import { UpdateTodoRequest} from '../requests/UpdateTodoRequest'
import { getUserId } from '../lambda/utils'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('businessLayer')

export async function getAllTodoItems(userId: String): Promise<TodoItem[]> {
  return todoAccess.getAllTodoItems(userId)
}

export async function createTodoItem(
  createTodoItemRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent,
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(event)
  const timestamp = new Date().toISOString() 

  logger.info(`Creating item with id ${itemId} for user ${userId}. name = ${JSON.stringify(createTodoItemRequest)}`)
  return await todoAccess.createTodoItem({
    todoId: itemId,
    userId: userId,
    createdAt: timestamp,
    name: createTodoItemRequest.name,
    dueDate: createTodoItemRequest.dueDate,
    done: false
  })
}

export async function deleteTodoItem(
    event: APIGatewayProxyEvent,
  ) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    await todoAccess.deleteTodoItem(todoId, userId)
  }

  export async function updateTodoItem(event: APIGatewayProxyEvent) : Promise<boolean> {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    if(! await todoAccess.isItemExists(userId, todoId)) {
        return false
    }

    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    await todoAccess.updateTodoItem(todoId, userId, updatedTodo)

    return true
  }


  
// export async deleteTodoItem(userId: String, todoId: String): Promise<TodoItem> {
//     await this.docClient.put({
//       TableName: this.todoTable,
//       Item: theItem
//     }).promise()

//     return theItem
//   }