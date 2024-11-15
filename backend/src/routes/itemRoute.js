import express from "express";

import * as itemController from "../controllers/itemController.js";

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:id", itemController.deleteItem);
// TODO3: add a router for the filter function
router.get("/filter",itemController.filterItems);

// routes/memberRoutes.js
// import express from "express";
import * as memberController from "../controllers/memberController.js";


router.get("/", memberController.getMembers);  // Get all members
router.post("/", memberController.createMember);  // Create a new member
router.delete("/:id", memberController.deleteMember);  // Delete a member by ID


export default router;
