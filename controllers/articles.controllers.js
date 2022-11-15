const { selectArticles } = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        console.log(articles);
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}