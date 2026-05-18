const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

async function uploadToCloudinary(file, folder = "syncup") {
  if (!isCloudinaryConfigured()) {
    const error = new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server .env"
    );
    error.status = 503;
    throw error;
  }

  if (!file?.buffer) {
    const error = new Error("No file provided");
    error.status = 400;
    throw error;
  }

  const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    resourceType: result.resource_type,
  };
}

module.exports = { uploadToCloudinary };
