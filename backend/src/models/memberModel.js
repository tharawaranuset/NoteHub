// models/memberModel.js
import mongoose from "mongoose";

// Define the schema for Member
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'  // Link the member to the Item model
  }]
});

// Create and export the Member model
const Member = mongoose.model("Member", memberSchema);

export default Member;
