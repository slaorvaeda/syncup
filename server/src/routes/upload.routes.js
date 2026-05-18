const express = require("express");
const { uploadMedia } = require("../controllers/upload.controller");
const { authenticate, authorize } = require("../middleware/auth");
const { uploadImage, uploadFile } = require("../middleware/upload");

const router = express.Router();

function handleMulter(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Upload failed",
        });
      }
      next();
    });
  };
}

router.post(
  "/image",
  authenticate,
  authorize("coach", "admin"),
  handleMulter(uploadImage),
  uploadMedia
);

router.post(
  "/file",
  authenticate,
  authorize("coach", "admin"),
  handleMulter(uploadFile),
  uploadMedia
);

module.exports = router;
