const { selectArticles, selectArticleComments, insertComment } = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticles(article_id).then((article) => {
        res.status(200).send({ article: article[0] })
    }).catch((err) => {
        next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    selectArticleComments(article_id).then((comments) => {
        res.status(200).send({ comments })
    }).catch((err) => {
        next(err)
    })
}

exports.postArticleComment = (req, res, next) => {
    const { article_id } = req.params
    insertComment(article_id, req.body).then((comment) => {
        res.status(201).send({ comment })
    }).catch((err) => {
        next(err)
    })
}