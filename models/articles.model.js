const db = require('../db/connection.js')


exports.selectArticles = (articleId) => {
    let valuesArray = []
    let queryString = `
    SELECT 
    users.username AS author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    count.comment_count

    FROM articles
    JOIN users 
    ON articles.author = users.username
    JOIN
        (SELECT  ar.article_id, 
            COUNT(cm.comment_id) AS comment_count
        FROM articles ar
        LEFT JOIN comments cm
         ON ar.article_id = cm.article_id
         GROUP BY ar.article_id) as count
    ON articles.article_id = count.article_id
    `
    if (articleId) {
        queryString += `WHERE articles.article_id = $1`
        valuesArray.push(articleId)
    }

    queryString += ` ORDER BY articles.created_at DESC`
    return db.query(queryString, valuesArray)
        .then((res) => {
            if (res.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "article not found" })
            }
            return res.rows
        })
}