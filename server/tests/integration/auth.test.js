const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");

describe("Auth API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterEach(async () => {
    await User.deleteMany({ email: /@authtest\.com$/ });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /auth/register", () => {
    it("returns 400 for invalid body", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "",
        email: "bad-email",
        password: "123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it("registers a new user", async () => {
      const email = `user${Date.now()}@authtest.com`;
      const res = await request(app).post("/auth/register").send({
        name: "Test User",
        email,
        password: "secret123",
        role: "student",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(email);
    });
  });

  describe("POST /auth/login", () => {
    it("returns 400 for invalid email format", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "not-valid",
        password: "secret123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });

    it("returns 401 for wrong credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "missing@authtest.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
