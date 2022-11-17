const db = require('../db/connection.js')

exports.selectUsers = () => {
    const qStr =
        `
      SELECT * FROM users
      `
    return db.query(qStr).then((res) => {
        return res.rows
    })
}