import express from "express";

import * as itemController from "../controllers/itemController.js";
import * as commentController from "../controllers/commentController.js";
import * as memberController from "../controllers/memberController.js";
import upload from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/", itemController.createItem);
router.delete("/:id", itemController.deleteItem);
router.get("/filter", itemController.filterItems);
router.patch("/:itemId", itemController.likeItems);
router.patch("/:id/addeditor", itemController.addEditor);
router.patch("/:id/deleditor", itemController.delEditor);
router.patch("/:itemId/edit", itemController.editItems);

export default router;
