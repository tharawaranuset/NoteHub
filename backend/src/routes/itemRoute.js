import express from "express";

import * as itemController from "../controllers/itemController.js";
import * as commentController from "../controllers/commentController.js";
import * as memberController from "../controllers/memberController.js";

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:id", itemController.deleteItem);
// TODO3: add a router for the filter function
router.get("/filter",itemController.filterItems);




router.get("/", memberController.getMembers);  // Get all members
router.post("/", memberController.createMember);  // Create a new member
router.delete("/:id", memberController.deleteMember);  // Delete a member by ID

router.post("/:id/comments", commentController.addComment); // Add a comment
router.get("/:id/comments", commentController.getComments); // Get all comments
router.delete("/:id/comments/:commentId", commentController.deleteComment);  // Delete a member by ID

export default router;