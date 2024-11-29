import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
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
  likes:{
    type: [String], // อาร์เรย์ของ userId ที่ไลค์
    default: [],
    required: true,
  },
  comments: [commentSchema], // Embed comments
  files:[fileSchema], 
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
