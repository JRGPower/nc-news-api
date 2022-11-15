const db = require('../db/connection.js')

exports.checkArticleExists = (articleId) => {
    const articleQueryString =
        `SELECT article_id FROM articles
    WHERE article_id = $1`
    return db.query(articleQueryString, [articleId]).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article not found" })
        }
    })
}
exports.checkExists = (colName, tableName, query, msg) => {
    const qStr =
        `
        SELECT ${colName} FROM ${tableName}
        WHERE ${colName} = '${query}'
        `
    return db.query(qStr).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({ status: 404, "msg": msg })
        }
    })
}

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

exports.selectArticleComments = (articleId) => {

    const commentQueryString = `
    SELECT 
        com.comment_id,
        com.votes,
        com.created_at,
        users.username AS author,
        com.body
    FROM articles ar
    JOIN users
    ON ar.author = users.username

    JOIN comments com
    on ar.article_id = com.article_id

    WHERE ar.article_id = $1
    ORDER BY com.created_at DESC
    `
    return this.checkArticleExists(articleId)
        .then(() => {
            return db.query(commentQueryString, [articleId])
        })
        .then((res) => {
            return res.rows
        })
}

exports.insertComment = (articleId, commentBody) => {
    if (!commentBody.username || !commentBody.body) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    const { username, body } = commentBody
    const qStr = `
        INSERT INTO comments 
        (body,
        article_id,
        author,
        votes,
        created_at)

        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *
        `
    return this.checkExists("username", "users", username, "user does not exist")
        .then(() => {
            return this.checkExists("article_id", "articles", articleId, "article does not exist")
        })
        .then(() => {
            return db.query(qStr, [body, articleId, username, 0, new Date()])
        })
        .then((res) => {
            return res.rows[0]
        })
}