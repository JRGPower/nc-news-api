const { selectArticles } = require("../models/articles.model")

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
        if (article.length === 0) {
            res.status(200).send({ article })
        } else {
            res.status(200).send({ article: article[0] })
        }
    }).catch((err) => {
        next(err)
    })
}