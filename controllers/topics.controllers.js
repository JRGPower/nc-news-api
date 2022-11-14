const { selectTopics } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}

exports.invalidURL = (req, res,) => {
    res.status(404).send({ msg: "invalid url" })
}

exports.catchAll = (err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" });
};