require("dotenv").config({ path: ".env.test", quiet: true });
require("dotenv").config({ quiet: true });

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.NODE_ENV = "test";
