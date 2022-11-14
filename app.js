const express = require('express')
const { getTopics, invalidURL, catchAll } = require('./controllers/topics.controllers')

const app = express()

app.get('/api/topics', getTopics)

app.all('/*', invalidURL)

app.use(catchAll)

module.exports = app