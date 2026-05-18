const request = require("supertest");
const app = require("../../src/app");

describe("GET /health", () => {
  it("returns health metrics payload", async () => {
    /** @type {import('supertest').Response} */
    const res = await request(app).get("/health");

    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("metrics");
    expect(res.body.metrics).toHaveProperty("mongodb");
    expect(res.body.metrics).toHaveProperty("redis");
    expect(res.body.metrics).toHaveProperty("memory");
    expect(res.body).toHaveProperty("uptime");
  });
});
