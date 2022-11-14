const db = require('../db/connection.js')

exports.selectTopics = () => {
    let queryString = `
    SELECT * FROM topics
    `
    return db.query(queryString).then((res) => {
        return res.rows
    })
}