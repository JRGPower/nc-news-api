const format = require("pg-format");
const db = require("../db/connection.js");

exports.checkExists = (colName, tableName, query, msg) => {
  const validArguments = {
    topics: ["slug", "description"],
    users: ["username", "name", "avatar_url"],
    articles: [
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
    ],
    comments: [
      "comment_id",
      "body",
      "article_id",
      "author",
      "votes",
      "created_at",
    ],
  };
  if (
    validArguments.hasOwnProperty(tableName) &&
    validArguments[tableName].includes(colName)
  ) {
    const qStr = format(
      `SELECT %I FROM %I
            WHERE %I = $1`,
      colName,
      tableName,
      colName
    );

    return db.query(qStr, [query]).then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: msg });
      }
    });
  }
};

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const validSortTerms = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSortTerms.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  //
  let queryString = `
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    count.comment_count
  
    FROM articles    
    JOIN
        (SELECT  articles.article_id, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments 
         ON articles.article_id = comments.article_id
         GROUP BY articles.article_id) as count
    ON articles.article_id = count.article_id
    `;
  if (topic) {
    return this.checkExists("slug", "topics", topic, "topic does not exist")
      .then(() => {
        queryString += ` WHERE articles.topic = $1`;
        queryString += ` ORDER BY ${sort_by} ${order}`;
        return db.query(queryString, [topic]);
      })
      .then((res) => {
        return res.rows;
      });
  } else {
    queryString += ` ORDER BY ${sort_by} ${order}`;
    return db.query(queryString).then((res) => {
      return res.rows;
    });
  }
};

exports.selectArticleById = (article_id) => {
  let qStr = `
SELECT 
articles.author, 
articles.title, 
articles.article_id, 
articles.topic, 
articles.body, 
articles.created_at, 
articles.votes,
count.comment_count

FROM articles    
JOIN
    (SELECT  articles.article_id, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
     ON articles.article_id = comments.article_id
     GROUP BY articles.article_id) as count
ON articles.article_id = count.article_id
WHERE articles.article_id = $1
`;
  return db.query(qStr, [article_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return res.rows;
  });
};

exports.selectArticleComments = (articleId) => {
  const commentQueryString = `
    SELECT 
        com.comment_id,
        com.votes,
        com.created_at,
        com.author AS author,
        com.body
    FROM articles ar

    JOIN comments com
    on ar.article_id = com.article_id

    WHERE ar.article_id = $1
    ORDER BY com.created_at DESC
    `;
  return this.checkExists(
    "article_id",
    "articles",
    articleId,
    "article does not exist"
  )
    .then(() => {
      return db.query(commentQueryString, [articleId]);
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertComment = (articleId, commentBody) => {
  if (!commentBody.username || !commentBody.body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const { username, body } = commentBody;
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
        `;
  return this.checkExists(
    "article_id",
    "articles",
    articleId,
    "article does not exist"
  )
    .then(() => {
      return db.query(qStr, [body, articleId, username, 0, new Date()]);
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.updateArticle = (article_id, body) => {
  if (!body.inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { inc_votes } = body;
  const qStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `;

  return this.checkExists(
    "article_id",
    "articles",
    article_id,
    "article does not exist"
  )
    .then(() => {
      return db.query(qStr, [inc_votes, article_id]);
    })
    .then((res) => {
      return res.rows[0];
    });
};
