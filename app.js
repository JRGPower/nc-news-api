const express = require("express");
const cors = require("cors");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComment,
  patchArticle,
} = require("./controllers/articles.controllers");
const { deleteComment } = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  invalidURL,
  catchAll,
  invalidInput,
} = require("./error_handling/errors");
const { getApi } = require("./controllers/api.controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticle);

app.all("/*", invalidURL);

app.use(invalidInput);
app.use(catchAll);

module.exports = app;
