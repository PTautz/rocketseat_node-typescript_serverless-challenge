import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

interface ITemplate {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const id = uuidv4();

  const todo: ITemplate = {
    id: String(id),
    user_id: userid,
    title,
    done: false,
    deadline: new Date(deadline).toISOString()
  }

  await document.put({
    TableName: "todos",
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo was created successfully!",
      todo: todo,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}