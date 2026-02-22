const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  uploadFile,
  uploadMiddleware,
} = require("../controllers/threatController");

router.post("/upload", protect, uploadMiddleware, uploadFile);

module.exports = router;