const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8, fields: 30 },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, and WebP images are supported");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});
module.exports = upload;
