const { selectArticles, selectArticleComments, insertComment, updateArticle, selectArticleById } = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query
    selectArticles(topic, sort_by, order).then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
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

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    updateArticle(article_id, req.body).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}