<<<<<<< HEAD
import express from "express";

import * as itemController from "../controllers/itemController.js";
import * as commentController from "../controllers/commentController.js";
import * as memberController from "../controllers/memberController.js";

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:id", itemController.deleteItem);
router.get("/filter",itemController.filterItems);
router.patch("/:itemId",itemController.likeItems);



router.get("/", memberController.getMembers);  // Get all members
router.post("/", memberController.createMember);  // Create a new member
router.delete("/:id", memberController.deleteMember);  // Delete a member by ID

export default router;
||||||| empty tree
=======
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

export default router;
>>>>>>> 4cbffb31080ae9ff1a84befa383667974a90a44d
