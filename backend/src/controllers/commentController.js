
import Item from "../models/itemModel.js";

// Add a comment to an item
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID
    const { comment } = req.body; // Get comment text from the request body

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty!" });
    }

    const item = await Item.findById(id); // Find the item by ID
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.comments.push({ text: comment }); // Add the comment
    await item.save(); // Save the updated item

    res.status(201).json({ message: "Comment added successfully!", comments: item.comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// Get all comments for an item
export const getComments = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID

    const item = await Item.findById(id); // Find the item by ID
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item.comments); // Return all comments
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};
