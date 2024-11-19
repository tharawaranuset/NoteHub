const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const Item = require("../models/Item");

// Item routes
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.post("/", async (req, res) => {
  const { name, subject, note } = req.body;
  const newItem = new Item({ name, subject, note });
  await newItem.save();
  res.status(201).json(newItem);
});

router.delete("/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Comment routes
router.post("/:id/comments", commentController.addComment); // Add a comment
router.get("/:id/comments", commentController.getComments); // Get all comments

module.exports = router;
