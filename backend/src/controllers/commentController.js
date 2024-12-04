import Item from "../models/itemModel.js";

// เพิ่มคอมเมนต์เข้าในโน้ต
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const { comment, author } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty!" });
    }

    const item = await Item.findById(id); 
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (author === null) {
      item.comments.push({ text: comment }); 
    } else {
      item.comments.push({ text: comment, author: author }); 
    }
    await item.save(); 

    res
      .status(201)
      .json({
        message: "Comment added successfully!",
        comments: item.comments,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// เก็บตอมเมนต์ทุกอันจากโน้ต
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id); 
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item.comments); 
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedComments = item.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    if (updatedComments.length === item.comments.length) {
      return res.status(404).json({ error: "Comment not found" });
    }

    item.comments = updatedComments;
    await item.save();

    res.status(200).json({
      message: "Comment successfully deleted",
      comments: item.comments,
    });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
