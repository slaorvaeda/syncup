const formatZodErrors = (error) => {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
};

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = source === "query" ? req.query : req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(result.error),
      });
    }

    if (source === "query") {
      req.query = result.data;
    } else {
      req.body = result.data;
    }

    next();
  };
};

module.exports = { validate, formatZodErrors };
