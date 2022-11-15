const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')
const { invalidURL, catchAll, } = require('./error_handling/errors')

const app = express()

app.get('/api/topics', getTopics)

app.all('/*', invalidURL)

app.use(catchAll)

module.exports = app