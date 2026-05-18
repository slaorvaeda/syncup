const { registerSchema, loginSchema } = require("../../src/validators/auth.validator");

describe("auth validators", () => {
  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "Coach",
        email: "coach@test.com",
        password: "secret123",
        role: "coach",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        name: "Coach",
        email: "coach@test.com",
        password: "123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        name: "Coach",
        email: "not-an-email",
        password: "secret123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.safeParse({
        email: "user@test.com",
        password: "secret123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing password", () => {
      const result = loginSchema.safeParse({
        email: "user@test.com",
      });
      expect(result.success).toBe(false);
    });
  });
});
