function emitIo(req, event, data) {
  const io = req.app.get("io");
  if (io) {
    io.emit(event, data);
  }
}

module.exports = { emitIo };
