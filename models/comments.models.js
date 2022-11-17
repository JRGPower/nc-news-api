const db = require('../db/connection.js')


exports.removeComment = (comment_id) => {
  const qStr =
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
      `
  return db.query(qStr, [comment_id]).then((res) => {
    if (!res.rows[0]) {
      return Promise.reject({ status: 404, msg: "comment not found" })
    }
  })
}