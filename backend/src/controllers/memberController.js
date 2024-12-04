import Member from "../models/memberModel.js";
import Item from "../models/itemModel.js"; 

// สร้าง member (ผู้ใช้)
export const createMember = async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ message: "Name is required" });
    }

    const alreadyhave = await Member.findOne({ name: userName });
    if (alreadyhave) {
      return res.status(409).json({ message: "Member already exists" });
    }

    const newMember = new Member({ name: userName });
    await newMember.save();

    res
      .status(200)
      .json({ message: "Member created successfully", member: newMember });
  } catch (err) {
    console.error("Error creating member:", err); // เพิ่มข้อความที่ทำให้เห็นข้อผิดพลาดชัดเจนขึ้น
    res
      .status(500)
      .json({ error: "Failed to create member", details: err.message });
  }
};

// เอาผู้ใช้ทั้งหมด
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate("items"); 
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

// ลบผู้ใช้และโน้ตที่เกี่ยวข้องกับผู้ใช้คนนั้น
export const deleteMember = async (req, res) => {
  const { userName } = req.params;
  try {
    // ค้นหาสมาชิกตาม userName และลบข้อมูล
    const member = await Member.findOne({ name: userName });

    if (!member) {
      return res.status(404).json({ message: "ไม่พบสมาชิกที่ต้องการลบ" });
    }
    await Item.deleteMany({ name: { $in: member.name } });

    await Item.updateMany(
      { editor: userName }, // ค้นหา Item ที่มี userName ใน editor
      { $pull: { editor: userName } } // ลบ userName ออกจาก array editor
    );

    // ลบสมาชิก
    await Member.deleteOne({ _id: member._id });

    res.status(200).json({ message: "ลบสมาชิกสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบสมาชิก" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { userName, id } = req.body;

    // ค้นหาสมาชิกที่มีชื่อผู้ใช้ตรงกับ userName
    const member = await Member.findOne({ name: userName });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // เพิ่ม id ใหม่ลงใน list ของ items (สมมติว่า list เป็น array ที่เก็บ ids)
    member.items.push(id);

    // บันทึกการอัปเดต
    await member.save();

    // ส่งกลับคำตอบว่าอัปเดตสำเร็จ
    res.status(200).json({ message: "Member updated successfully", member });
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const findMember = async (req, res) => {
  const { userName } = req.query;

  if (!userName) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const member = await Member.findOne({ name: userName });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (err) {
    console.error("Error finding member:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
