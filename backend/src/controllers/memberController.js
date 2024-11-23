// controllers/memberController.js
import Member from "../models/memberModel.js";
import Item from "../models/itemModel.js";  // Import Item model to delete associated items

// Create a new member
export const createMember = async (req, res) => {
  try {
    const { name } = req.body;
    const newMember = new Member({ name });
    await newMember.save();
    res.status(200).json({ message: 'Member created successfully', member: newMember });
  } catch (err) {
    res.status(500).json({ error: "Failed to create member" });
  }
};

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('items');  // Populate the items associated with each member
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

// Delete a member and remove associated items
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the member by ID
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Delete all items associated with the member
    await Item.deleteMany({ name: { $in: member.name } });

    // Now delete the member itself
    await Member.findByIdAndDelete(id);
    res.status(200).json({ message: "Member and associated items deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete member" });
  }
};
