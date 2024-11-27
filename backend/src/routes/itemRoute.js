import express from "express";

import * as itemController from "../controllers/itemController.js";
import * as commentController from "../controllers/commentController.js";
import * as memberController from "../controllers/memberController.js";
import upload from "../controllers/fileController.js" 

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:id", itemController.deleteItem);
router.get("/filter",itemController.filterItems);
router.patch("/:itemId",itemController.likeItems);
router.patch("/:itemId/edit",itemController.editItems);



// router.get("/", memberController.getMembers);  // Get all members
// router.post("/", memberController.createMember);  // Create a new member
// router.delete("/:id", memberController.deleteMember);  // Delete a member by ID

export default router;
