const { parsePagination } = require("../../src/utils/pagination");

describe("parsePagination", () => {
  it("uses defaults when query is empty", () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10 });
  });

  it("parses valid page and limit", () => {
    expect(parsePagination({ page: "2", limit: "5" })).toEqual({
      page: 2,
      limit: 5,
    });
  });

  it("caps limit at 50", () => {
    expect(parsePagination({ limit: "100" }).limit).toBe(50);
  });

  it("falls back for invalid values", () => {
    expect(parsePagination({ page: "-1", limit: "0" })).toEqual({
      page: 1,
      limit: 10,
    });
  });
});
