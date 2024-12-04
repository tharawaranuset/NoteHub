import express from "express";

import * as commentController from "../controllers/commentController.js";

const router = express.Router();

// Item routes
// Comment routes
router.post("/:id/", commentController.addComment); // เพิ่มคอมเมนต์
router.get("/:id/", commentController.getComments); // เอาคอมเมนต์ทั้งหมด
router.delete("/:id/:commentId", commentController.deleteComment); // ลบคอมเมนต์

export default router;
