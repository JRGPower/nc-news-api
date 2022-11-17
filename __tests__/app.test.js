const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('ENDPOINT TESTS', () => {
    describe('GET /api/topics', () => {
        test('GET 200 - should return an array with all topics from db', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then((res) => {
                    expect(res.body.topics).toBeInstanceOf(Array)
                    expect(res.body.topics.length).toBeGreaterThan(0)
                    res.body.topics.forEach((topic) => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        );
                    });
                })
        });
    });
    describe('GET /api/articles', () => {
        test('GET 200 - should return an array with all articles from db - sorted by defaults', () => {
            return request(app)
                .get('/api/articles')
                .expect(200).then((res) => {
                    expect(res.body.articles).toBeInstanceOf(Array)
                    expect(res.body.articles.length).toBeGreaterThan(0)
                    expect(res.body.articles).toBeSortedBy("created_at", { descending: true })
                    res.body.articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(String),
                            })
                        );
                        const dateCreated = new Date(article.created_at)
                        expect(dateCreated).toBeInstanceOf(Date)
                    });
                })
        });
        describe('GET /api/articles - queries', () => {
            describe('GET 200 - /api/articles/ - sort_by', () => {
                test("sort by author", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=author")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("author", {
                                descending: true,
                            });
                        });
                });
                test("sort by title", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=title")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("title", {
                                descending: true,
                            });
                        });
                });
                test("sort by article_id", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=article_id")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("article_id", {
                                descending: true,
                            });
                        });
                });
                test("sort by topic", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=topic")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("topic", {
                                descending: true,
                            });
                        });
                });
                test("sort by votes", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=votes")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("votes", {
                                descending: true,
                            });
                        });
                });
                test("sort by comment_count", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=comment_count")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("comment_count", {
                                descending: true, coerce: true
                            });
                        });
                });
            });
            describe('GET 200 - /api/articles/ - order', () => {
                test("order ascending - sorted by default - created_at", () => {
                    return request(app)
                        .get("/api/articles/?order=asc")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("created_at", {
                                ascending: true,
                            });
                        });
                })
                test("order ascending - sorted_by votes", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=votes&order=asc")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("votes", {
                                ascending: true,
                            });
                        });
                })

            });
            describe('GET 200 - /api/articles/ - topic', () => {
                test('filter by topic returning all topics', () => {
                    return request(app)
                        .get("/api/articles/?topic=mitch&sort_by=votes&order=asc")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toBeInstanceOf(Array)
                            expect(res.body.articles.length).toBeGreaterThan(0)
                            expect(res.body.articles).toBeSortedBy("votes", {
                                ascending: true,
                            });
                            res.body.articles.forEach((article) => {
                                expect(article.topic).toBe('mitch');
                            });
                        });
                });
                test('return empty array when no articles exist with the"topic"', () => {
                    return request(app)
                        .get("/api/articles/?topic=paper&sort_by=votes&order=asc")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.articles).toEqual([])
                        });
                });
            });
            describe('GET - query errors', () => {
                test("GET 400 - invalid sort term", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=aBunchOfFlowers")
                        .expect(400)
                        .then((res) => {
                            expect(res.body.msg).toBe("Bad Request");
                        });
                })
                test("GET 400 - invalid order term", () => {
                    return request(app)
                        .get("/api/articles/?sort_by=votes&order=greenest")
                        .expect(400)
                        .then((res) => {
                            expect(res.body.msg).toBe("Bad Request");
                        });
                })
                test("GET 404 - invalid topic", () => {
                    return request(app)
                        .get("/api/articles/?topic=chesss")
                        .expect(404)
                        .then((res) => {
                            expect(res.body.msg).toBe("topic does not exist");
                        });
                })
            });
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('GET 200 - returns single article when given valid id', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then((res) => {
                    expect(res.body.article.article_id).toBe(1)
                    expect(res.body.article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        })
                    );
                })
        });
        test('GET 404 - valid id but no data found in db', () => {
            return request(app)
                .get("/api/articles/500")
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("article not found")
                })
        });
        test('GET 400 - invalid id - respond with bad request', () => {
            return request(app)
                .get("/api/articles/not_an_id")
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('GET 200 - retrns all comments from a given article', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then((res) => {
                    expect(res.body.comments).toBeInstanceOf(Array)
                    expect(res.body.comments.length).toBeGreaterThan(0)
                    expect(res.body.comments).toBeSortedBy("created_at", { descending: true })
                    res.body.comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String)
                            })
                        )
                    })
                })
        });
        test('GET 200 - return empty array for article with no comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then((res) => {
                    expect(res.body.comments).toEqual([])
                })
        });
        test('GET 404 - article id not found', () => {
            return request(app)
                .get("/api/articles/1000/comments")
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("article does not exist")
                })
        });
        test('GET 400 - invalid article_id - bad request', () => {
            return request(app)
                .get("/api/articles/Notanumber/comments")
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
    });
    describe('POST /api/articles/:article_id/comments', () => {
        test('POST 201 - responds with comment object', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'lurker', body: 'still lurkin' })
                .expect(201)
                .then((res) => {
                    expect(res.body.comment).toEqual({
                        comment_id: expect.any(Number),
                        body: 'still lurkin',
                        article_id: 1,
                        author: 'lurker',
                        votes: 0,
                        created_at: expect.any(String)
                    })
                    const dateCreated = new Date(res.body.comment.created_at)
                    expect(dateCreated).toBeInstanceOf(Date)
                })
        });
        test('POST 404 - article id not found', () => {
            return request(app)
                .post("/api/articles/1001/comments")
                .send({ username: 'lurker', body: 'still lurkin' })
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("article does not exist")
                })
        });
        test('POST 400 - invalid article_id - bad request', () => {
            return request(app)
                .post("/api/articles/StillNotaNumber/comments")
                .send({ username: 'lurker', body: 'still lurkin' })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('POST 400 - invalid body - user does not exist - foreign key violation', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({ username: 'invalid_user_', body: 'still lurkin' })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('POST 400 - invalid body - wrong structure: no body', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({ username: 'lurker' })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('POST 400 - invalid body - wrong structure: body empty', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({ username: 'lurker', body: '' })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('POST 201 - invalid body - ignores additional body properties', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({ username: 'lurker', body: 'still lurkin', some: 'extra', props: 13 })
                .expect(201)
                .then((res) => {
                    expect(res.body.comment).toEqual({
                        comment_id: expect.any(Number),
                        body: 'still lurkin',
                        article_id: 1,
                        author: 'lurker',
                        votes: 0,
                        created_at: expect.any(String)
                    })
                    const dateCreated = new Date(res.body.comment.created_at)
                    expect(dateCreated).toBeInstanceOf(Date)
                })
        });
    });
    describe('PATCH /api/articles/:article_id ', () => {
        test('PATCH 200 - increase votes and respond with updated article', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: 10 })
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    );
                    const dateCreated = new Date(res.body.article.created_at)
                    expect(dateCreated).toBeInstanceOf(Date)
                    expect(res.body.article.votes).toBeGreaterThanOrEqual(10)
                });
        });
        test('PATCH 200 - reduces votes and respond with updated article', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: -10 })
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    );
                    const dateCreated = new Date(res.body.article.created_at)
                    expect(dateCreated).toBeInstanceOf(Date)
                    expect(res.body.article.votes).toBe(-10)
                });
        });
        test('PATCH 404 - article not found', () => {
            return request(app)
                .patch("/api/articles/5000")
                .send({ inc_votes: 10 })
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("article does not exist")
                })
        });
        test('PATCH 400 - invalid article_id - bad request', () => {
            return request(app)
                .patch("/api/articles/worcestershireSauce")
                .send({ inc_votes: 10 })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('PATCH 400 - invalid body - inc_votes missing', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_: 10 })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('PATCH 400 - invalid body - newVote not a number', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: 'cats' })
                .expect(400)
                .then((res) => {
                    expect(res.body.msg).toBe("Bad Request")
                })
        });
        test('PATCH 200 - ignores additional proprties on patch body', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: 10, extra: "prop" })
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    );
                    const dateCreated = new Date(res.body.article.created_at)
                    expect(dateCreated).toBeInstanceOf(Date)
                    expect(res.body.article.votes).toBeGreaterThanOrEqual(10)
                });
        });
    });
    describe('GET /api/users', () => {
        describe('GET /api/users', () => {
            test('GET 200 - should return an array with all users', () => {
                return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.users).toBeInstanceOf(Array)
                        expect(res.body.users.length).toBeGreaterThan(0)
                        res.body.users.forEach((user) => {
                            expect(user).toEqual(
                                expect.objectContaining({
                                    username: expect.any(String),
                                    name: expect.any(String),
                                    avatar_url: expect.anything()
                                })
                            );
                        });
                    })
            });
        });
    });
    describe('Errors', () => {
        test("invalid url", () => {
            return request(app)
                .get("/api/no_topics_to_be_found_here")
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).toBe("invalid url");
                });
        });
    });
});
