const db = require('../db/connection.js')


exports.selectArticles = () => {
    const queryString = `
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
    ORDER BY articles.created_at DESC
    `

    return db.query(queryString)
        .then((res) => {
            return res.rows
        })
}