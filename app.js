const express = require('express')
const { getTopics, invalidURL } = require('./controllers/topics.controllers')

const app = express()

app.get('/api/topics', getTopics)

app.all('/*', invalidURL)

module.exports = app