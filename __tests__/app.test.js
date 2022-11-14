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
        test('GET 200 - should return all an array with all topics from db', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then((res) => {
                    expect(res.body.topics).toBeInstanceOf(Array)
                    expect(res.body.topics.length).toBeGreaterThan(0)
                })
        });
        test('GET 200 - all topic objects within array should have correct structure', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then((res) => {
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
