const express = require('express')
const app = express()
app.use(express.json())

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')

let db = null

const {format} = require('date-fns')

const isValidDate = require('date-fns/isValid')

const initDBAndRunServer = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    console.log('DB initialization is successfull...')
    app.listen(3000, () => {
      console.log('server is running at http://localhost:3000')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initDBAndRunServer()

// CHECK status and priority provided
const hasStatusAndPriority = requestQuery => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  )
}

//CHECK status and category provided

const hasStatusAndCategory = requestQuery => {
  return (
    requestQuery.status !== undefined && requestQuery.category !== undefined
  )
}

//CHEKC category and priority provided

const hasCategoryAndPriority = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}

// CHECK status provided

const hasStatus = requestQuery => {
  return requestQuery.status !== undefined
}

//CHECK priority provided

const hasPriority = requestQuery => {
  return requestQuery.priority !== undefined
}

//CHECK category provided

const hasCategory = requestQuery => {
  return requestQuery.category !== undefined
}

let statusValues = ['TO DO', 'IN PROGRESS', 'DONE']

let priorityValues = ['HIGH', 'MEDIUM', 'LOW']

let categoryValues = ['WORK', 'HOME', 'LEARNING']

// GET TODOS LIST API

app.get('/todos/', async (request, response) => {
  const {search_q = '', status, priority, category} = request.query

  let getTodosQuery
  let data

  switch (true) {
    case hasStatusAndPriority(request.query):
      if (!priorityValues.includes(priority)) {
        response.status(400)
        response.send('Invalid Todo Priority')
        break
      } else if (!statusValues.includes(status)) {
        response.status(400)
        response.send('Invalid Todo Status')
        break
      } else {
        getTodosQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              todo LIKE '%${search_q}%'  
                AND
              status = '${status}'
              AND
              priority = '${priority}'
            `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))

        break
      }

    case hasStatusAndCategory(request.query):
      if (!statusValues.includes(status)) {
        response.status(400)
        response.send('Invalid Todo Status')
        break
      } else if (!categoryValues.includes(category)) {
        response.status(400)
        response.send('Invalid Todo Category')
        break
      } else {
        getTodosQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                todo LIKE '%${search_q}%'  
                AND
                status = '${status}'
                AND
                category = '${category}'
              `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))
        break
      }

    case hasCategoryAndPriority(request.query):
      if (!priorityValues.includes(priority)) {
        response.status(400)
        response.send('Invalid Todo Priority')
        break
      } else if (!categoryValues.includes(category)) {
        response.status(400)
        response.send('Invalid Todo Category')
        break
      } else {
        getTodosQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                todo LIKE '%${search_q}%'  
                AND
                category = '${category}'
                AND
                priority = '${priority}'
              `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))
        break
      }

    case hasStatus(request.query):
      if (!statusValues.includes(status)) {
        response.status(400)
        response.send('Invalid Todo Status')
        break
      } else {
        getTodosQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                todo LIKE '%${search_q}%'  
                AND
                status = '${status}'
              `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))
        break
      }

    case hasPriority(request.query):
      if (!priorityValues.includes(priority)) {
        response.status(400)
        response.send('Invalid Todo Priority')
        break
      } else {
        getTodosQuery = `
                SELECT
                  *
                FROM
                  todo
                WHERE
                  todo LIKE '%${search_q}%'  
                  AND
                  priority = '${priority}'
                `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))
        break
      }
    case hasCategory(request.query):
      if (!categoryValues.includes(category)) {
        response.status(400)
        response.send('Invalid Todo Category')
        break
      } else {
        getTodosQuery = `
              SELECT
                *
              FROM
                todo
              WHERE 
                todo LIKE '%${search_q}%'  
                AND
                category = '${category}'
              `
        data = await db.all(getTodosQuery)
        const getDataInCamel = obj => {
          return {
            id: obj.id,
            todo: obj.todo,
            priority: obj.priority,
            status: obj.status,
            category: obj.category,
            dueDate: obj.due_date,
          }
        }
        response.send(data.map(obj => getDataInCamel(obj)))
        break
      }

    default:
      getTodosQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                todo LIKE '%${search_q}%'        `
      data = await db.all(getTodosQuery)
      const getDataInCamel = obj => {
        return {
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }
      }
      response.send(data.map(obj => getDataInCamel(obj)))
  }
})

// GET SPECIFIC TODO API

app.get('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const getSpecifiTodoQuery = `
     
      SELECT 
      *
      FROM
        todo
      WHERE
        id = ${todoId}`

  const data = await db.get(getSpecifiTodoQuery)

  response.send({
    id: data.id,
    todo: data.todo,
    priority: data.priority,
    status: data.status,
    category: data.category,
    dueDate: data.due_date,
  })
})

// LIST OF TODOS SPECIFIC DUE DATE

app.get('/agenda/', async (request, response) => {
  const {date} = request.query

  if (isValidDate(new Date(date)) === false) {
    response.send(400)
    response.send('Invalid Due Date')
  } else {
    const formattedDate = format(new Date(date), 'yyy-MM-dd')

    const getTodoBySpecificDueDateQuery = `
          SELECT
            *
          FROM 
            todo
          WHERE 
            due_date = '${formattedDate}'
          
    `

    const resultedData = await db.all(getTodoBySpecificDueDateQuery)

    const getDataInCamel = obj => {
      return {
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      }
    }
    response.send(resultedData.map(obj => getDataInCamel(obj)))
  }
})

// CREATE TODO IN TODO TABLE API

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body

  if (!statusValues.includes(status)) {
    response.status(400)
    response.send('Invalid Todo Status')
  } else if (!priorityValues.includes(priority)) {
    response.status(400)
    response.send('Invalid Todo Priority')
  } else if (!categoryValues.includes(category)) {
    response.status(400)
    response.send('Invalid Todo Category')
  } else if (isValidDate(new Date(dueDate)) === false) {
    response.status(400)
    response.send('Invalid Due Date')
  } else {
    formattedDate = format(new Date(dueDate), 'yyyy-MM-dd')

    const createTodoQuery = `
      INSERT INTO 
        todo(id, todo, priority, status, category, due_date)
      VALUES(
      ${id}, 
      '${todo}', 
      '${priority}', 
      '${status}', 
      '${category}', 
      '${formattedDate}'
      )
      
      `
    await db.run(createTodoQuery)
    response.send('Todo Successfully Added')
  }
})

// UPDATE TODO BY GIVEN TODO ID API

const hasCategoryInBody = bodyObj => {
  return bodyObj.category !== undefined
}

const hasStatusInBody = bodyObj => {
  return bodyObj.status !== undefined
}

const hasPriorityInBody = bodyObj => {
  return bodyObj.priority !== undefined
}

const hasTodoInBody = bodyObj => {
  return bodyObj.todo !== undefined
}

const hasDueDateInBody = bodyObj => {
  return bodyObj.dueDate !== undefined
}

app.put('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params

  let updateTodoQuery

  const {status, priority, category, dueDate, todo} = request.body

  switch (true) {
    case hasCategoryInBody(request.body):
      if (!categoryValues.includes(category)) {
        response.status(400)
        response.send('Invalid Todo Category')
        break
      } else {
        updateTodoQuery = `
         UPDATE todo
         SET category = '${category}'
         WHERE
          id = ${todoId}`

        await db.run(updateTodoQuery)
        response.send('Category Updated')
        break
      }

    case hasStatusInBody(request.body):
      if (!statusValues.includes(status)) {
        response.status(400)
        response.send('Invalid Todo Status')
        break
      } else {
        updateTodoQuery = `
            UPDATE todo
            SET status = '${status}'
            WHERE
              id = ${todoId}`

        await db.run(updateTodoQuery)
        response.send('Status Updated')
        break
      }

    case hasPriorityInBody(request.body):
      if (!priorityValues.includes(priority)) {
        response.status(400)
        response.send('Invalid Todo Priority')
        break
      } else {
        updateTodoQuery = `
            UPDATE todo
            SET priority = '${priority}'
            WHERE
              id = ${todoId}`

        await db.run(updateTodoQuery)
        response.send('Priority Updated')
        break
      }

    case hasTodoInBody(request.body):
      updateTodoQuery = `
         UPDATE todo
         SET todo = '${todo}'
         WHERE
          id = ${todoId}`

      await db.run(updateTodoQuery)
      response.send('Todo Updated')
      break

    case hasDueDateInBody(request.body):
      if (isValidDate(new Date(dueDate)) === false) {
        response.status(400)
        response.send('Invalid Due Date')
        break
      } else {
        formattedDate = format(new Date(dueDate), 'yyyy-MM-dd')

        updateTodoQuery = `
         UPDATE todo
         SET due_date = '${formattedDate}'
         WHERE
          id = ${todoId}`

        await db.run(updateTodoQuery)
        response.send('Due Date Updated')
        break
      }
  }
})

// DELETE THE SPECIFIC TODO BY GIVEN TODO ID API

app.delete('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params

  const deleteTodoQuery = `
        DELETE FROM 
          todo
        WHERE 
          id = ${todoId}
    `

  await db.run(deleteTodoQuery)

  response.send('Todo Deleted')
})

module.exports = app
