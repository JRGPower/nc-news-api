const format = require('pg-format')
const db = require('../db/connection.js')

exports.checkExists = (colName, tableName, query, msg) => {

    const validArguments = {
        users: ["username", "name", "avatar_url"],
        articles: ["article_id", "title", "topic", "author", "body", "created_at", "votes"],
        comments: ["comment_id", "body", "article_id", "author", "votes", "created_at"]
    }
    if (validArguments.hasOwnProperty(tableName) && validArguments[tableName].includes(colName)) {

        const qStr = format(
            `SELECT %I FROM %I
            WHERE %I = $1`,
            colName, tableName, colName)

        return db.query(qStr, [query]).then((res) => {
            if (res.rows.length === 0) {
                return Promise.reject({ status: 404, "msg": msg })
            }
        })
    }
}

exports.selectArticles = (articleId, topic, sort_by = "created_at", order = "desc") => {

    if (order !== "asc" && order !== "desc") {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    const validSortTerms =
        [
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
        ];

    if (!validSortTerms.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    let valuesArray = []
    let queryString =
        `
    SELECT 
    u.username AS author, 
    a.title, 
    a.article_id, 
    a.topic, 
    a.created_at, 
    a.votes,
    count.comment_count
  
    FROM articles a
    JOIN users u
    ON a.author = u.username
    JOIN
        (SELECT  ar.article_id, COUNT(cm.comment_id) AS comment_count
        FROM articles ar
        LEFT JOIN comments cm
         ON ar.article_id = cm.article_id
         GROUP BY ar.article_id) as count
    ON a.article_id = count.article_id
    `
    if (topic) {
        valuesArray.push(topic)
        queryString += ` WHERE a.topic = $${valuesArray.length}`
    }
    else if (articleId) {
        valuesArray.push(articleId)
        queryString += ` WHERE a.article_id = $${valuesArray.length}`
    }

    queryString += ` ORDER BY ${sort_by} ${order}`;

    return db.query(queryString, valuesArray)
        .then((res) => {
            if (res.rows.length === 0 && articleId !== null) {
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
    return this.checkExists("article_id", "articles", articleId, "article does not exist")
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
    return this.checkExists("article_id", "articles", articleId, "article does not exist")
        .then(() => {
            return db.query(qStr, [body, articleId, username, 0, new Date()])
        })
        .then((res) => {
            return res.rows[0]
        })
}

exports.updateArticle = (article_id, body) => {
    if (!body.inc_votes) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    const { inc_votes } = body
    const qStr =
        `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `

    return this.checkExists("article_id", "articles", article_id, "article does not exist")
        .then(() => {
            return db.query(qStr, [inc_votes, article_id])
        })
        .then((res) => {
            return res.rows[0]
        })
}