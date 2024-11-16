import mongoose from "mongoose";

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
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
