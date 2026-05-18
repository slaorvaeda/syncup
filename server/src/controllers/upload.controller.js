const { uploadToCloudinary } = require("../services/upload.service");

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use field name 'image' or 'file'.",
      });
    }

    const folder = req.body.folder || "syncup/feeds";
    const result = await uploadToCloudinary(req.file, folder);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.url,
        name: req.file.originalname,
        type: req.file.mimetype,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadMedia };
