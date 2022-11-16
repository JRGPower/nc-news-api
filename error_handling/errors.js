exports.invalidURL = (req, res,) => {
    res.status(404).send({ msg: "invalid url" })
}

exports.invalidInput = (err, req, res, next) => {
    if (err.code === "22P02" || err.code == "23503") {
        res.status(400).send({ msg: "Bad Request" });
    } else {
        next(err);
    }
};

exports.catchAll = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
    console.log(err);
    res.status(500).send({ msg: "internal server error" });
};