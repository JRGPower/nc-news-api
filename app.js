const express = require('express')
const { getArticles } = require('./controllers/articles.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { invalidURL, catchAll, } = require('./error_handling/errors')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.all('/*', invalidURL)

app.use(catchAll)

module.exports = app