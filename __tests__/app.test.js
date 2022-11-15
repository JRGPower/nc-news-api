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
        test('GET 200 - should return an array with all articles from db ', () => {
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
    });
    describe('GET /api/articles/:article_id', () => {
        test('GET 200 - returns single article when given valid id', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then((res) => {
                    console.log(res.body.article.article_id);
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
        test('GET 200 - valid id with no data found', () => {
            return request(app)
                .get("/api/articles/500")
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toEqual([])
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
