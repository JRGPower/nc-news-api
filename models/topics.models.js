const db = require('../db/connection.js')

exports.selectTopics = () => {
    let queryString = `
    SELECT * FROM topics
    `
    return db.query(queryString).then((res) => {
        console.log(res.rows);
        return res.rows
    })
}