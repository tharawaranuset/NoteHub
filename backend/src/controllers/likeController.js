import Like from "../models/likeModel.js";

export const addLike = async (req, res) => {
  // if(!req.body.name || !req.body.subject || !req.body.note){
    const { contentId, userIp } = req.body;

    try {
      // ตรวจสอบว่าไลค์นี้มีอยู่แล้วหรือไม่
      const existingLike = await Like.findOne({ contentId, userIp });
      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this content.' });
      }
  
      // เพิ่มไลค์ใหม่
      const newLike = new Like({ contentId, userIp });
      await newLike.save();
  
      res.status(200).json({ message: 'Liked successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};



export const getLikes = async (req, res) => {
    const { contentId } = req.params;

    try {
      const likeCount = await Like.countDocuments({ contentId });
      res.status(200).json({ likeCount });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};