import express from "express";

import * as commentController from "../controllers/commentController.js";

const router = express.Router();

// Item routes
// Comment routes
router.post("/:id/", commentController.addComment); // Add a comment
router.get("/:id/", commentController.getComments); // Get all comments
router.delete("/:id/:commentId", commentController.deleteComment); // Delete a member by ID

export default router;
