const { selectTopics } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}

exports.invalidURL = (req, res,) => {
    res.status(404).send({ msg: "invalid url" })
}