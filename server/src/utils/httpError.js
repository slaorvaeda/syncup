class HttpError extends Error {
  /**
   * @param {string} message
   * @param {number} status HTTP status code
   */
  constructor(message, status) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

module.exports = { HttpError };
