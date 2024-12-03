import Item from "../models/itemModel.js";

export const createItem = async (req, res) => {
  // if(!req.body.name || !req.body.subject || !req.body.note){
  try {
    const newItem = new Item(req.body);
    if (req.file) {
      console.log("path=" + req.file.path);
      newItem.files = req.file.path;
    }
    await newItem.save();

    res.status(200).json({ message: "OK", id: newItem._id });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const editItems = async (req, res) => {
  const { itemId } = req.params;
  const { note, fileName, filePath } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).send("Item not found");

    item.note = note; // อัปเดตเนื้อหาของโน้ต
    item.fileName = fileName; //อัพเดทชื่อไฟล์
    item.filePath = filePath; // อัพเดทที่อยู่ไฟล์
    await item.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (err) {
    res.status(500).send("Error updating item");
  }
};

export const addEditor = async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" }); // ส่งข้อมูลเป็น JSON

    if (item.editor.includes(userName)) {
      return res.status(400).json({ message: "User is already an editor" }); // ส่งข้อมูลเป็น JSON
    }

    if (userName != "") {
      item.editor.push(userName);
      await item.save();

      res.status(200).json({ message: "Item updated successfully", item });
    } else {
      res.status(400).json({ message: "No User", item });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating item" }); // ส่งข้อมูลเป็น JSON
  }
};

export const delEditor = async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" }); // ส่งข้อมูลเป็น JSON

    // ตรวจสอบว่า userName อยู่ใน editor หรือไม่
    if (!item.editor.includes(userName)) {
      return res.status(400).json({ message: "User is not an editor" }); // ส่งข้อมูลเป็น JSON
    }

    // ลบ userName ออกจาก array editor
    item.editor = item.editor.filter((editor) => editor !== userName);
    await item.save();

    res.status(200).json({ message: "Editor removed successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Error updating item" }); // ส่งข้อมูลเป็น JSON
  }
};

export const getItems = async (req, res) => {
  const items = await Item.find();

  res.status(200).json(items);
};

export const likeItems = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.body;

    // ค้นหาไอเทมในฐานข้อมูล
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    // ตรวจสอบว่า userId อยู่ในรายการไลค์แล้วหรือไม่
    const alreadyLiked = item.likes.includes(userId);

    if (alreadyLiked) {
      // หากไลค์แล้ว, ทำการ "อันไลค์"
      item.likes = item.likes.filter((id) => id !== userId); // ลบ userId ออกจากอาร์เรย์ likes
      await item.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      return res.status(200).json({ liked: false });
    } else {
      // หากยังไม่ไลค์, ทำการ "ไลค์"
      item.likes.push(userId); // เพิ่ม userId ไปยังอาร์เรย์ likes
      await item.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      return res.status(200).json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error processing request");
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params; // Assuming you pass the item ID via the URL

  try {
    const deletedItem = await Item.findByIdAndDelete(id); // Delete item by ID

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" }); // Item not found
    }

    res.status(200).json({ message: "Item successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const filterItems = async (req, res) => {
  // TODO3: implement this filter function
  try {
    const { filterName, filterSubject } = req.query;

    // Build the query object
    let query = {};
    if (filterSubject && filterSubject !== "ทั้งหมด") {
      query.subject = filterSubject;
    }

    if (filterName && filterName !== "ทั้งหมด") {
      query.name = filterName;
    }

    // Query the database
    const items = await Item.find(query);

    // Return the filtered items
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
