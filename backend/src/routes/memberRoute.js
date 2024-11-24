import express from "express";

import * as memberController from "../controllers/memberController.js";

const router = express.Router();

router.get("/", memberController.getMembers);
router.post("/", memberController.createMember);
router.delete("/:userName", memberController.deleteMember);
router.patch("/",memberController.updateMember);
router.get("/find", memberController.findMember);
export default router;
