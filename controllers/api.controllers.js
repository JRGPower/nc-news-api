const { readFile } = require('fs/promises')

exports.getApi = (req, res, next) => {
    return readFile(`${__dirname}/../db/endpoints.json`, "utf8")
        .then((data) => {
            res.send(JSON.parse(data))
        }).catch((err => {
            next(err)
        }))
}