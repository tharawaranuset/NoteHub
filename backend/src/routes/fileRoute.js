import express from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import Item from "../models/itemModel.js";

import * as fileController from "../controllers/fileController.js";
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const fileName = req.file.filename;
    const message = "File uploaded successfully!";

    res.json({
      message,
      fileName: req.file.filename,
      filePath: req.file.path,
    });
    
  } catch (err) {
    res.status(500).send("Error updating item");
  }
});

// จุดเก็บไฟล์ไว้ดาวน์โหลด
router.get("/download/:id", fileController.downloadFile);
router.delete("/delete/:id", fileController.deleteFile);

export default router;
