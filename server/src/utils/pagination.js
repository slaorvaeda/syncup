const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePagination(query = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (Number.isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  return { page, limit };
}

module.exports = { parsePagination, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };
