import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // URL or path to the uploaded image
    required: false,
  },
  comments: [CommentSchema], // Embed comments
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
