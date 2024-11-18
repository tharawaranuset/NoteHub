import express from "express";

import * as likeController from "../controllers/likeController.js";

const router = express.Router();

router.get("/", likeController.getLikes);
router.post("/", likeController.addLike);
//router.delete("/:id", itemController.deleteItem);
// TODO3: add a router for the filter function

export default router;