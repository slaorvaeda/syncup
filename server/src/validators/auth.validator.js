const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  role: z.enum(["coach", "student", "admin"]).optional(),
  avatar: z.string().url().optional().nullable(),
  programId: z.string().trim().max(100).optional().nullable(),
  cohortId: z.string().trim().max(100).optional().nullable(),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required").max(128),
});

module.exports = { registerSchema, loginSchema };
