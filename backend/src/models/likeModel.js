// backend/models/like.js
import mongoose from "mongoose";

// Reference ไปยัง Member และ Item โดยใช้ ObjectId
const likeSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  number:{type: Number,default:0,require:true},
  
});

// สร้าง Model สำหรับ Like
const Like = mongoose.model('Like', likeSchema);

export default Like;
