exports.invalidURL = (req, res,) => {
    res.status(404).send({ msg: "invalid url" })
}

exports.catchAll = (err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" });
};