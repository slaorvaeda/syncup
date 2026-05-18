const multer = require("multer");

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG, WebP, GIF) and PDF are allowed"));
    }
  },
});

const uploadImage = upload.single("image");
const uploadFile = upload.single("file");

module.exports = { uploadImage, uploadFile };
