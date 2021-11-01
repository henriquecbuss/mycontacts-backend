const express = require('express')
require('express-async-errors')

const cors = require('./middlewares/cors')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors)

app.use(express.json())

app.use(routes)

app.use(errorHandler)

app.listen(4000, () => console.log('Server started at http://localhost:4000'))
