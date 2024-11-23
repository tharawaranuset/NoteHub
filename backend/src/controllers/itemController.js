import Item from "../models/itemModel.js";

export const createItem = async (req, res) => {
  // if(!req.body.name || !req.body.subject || !req.body.note){
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getItems = async (req, res) => {
  const items = await Item.find();

  res.status(200).json(items);
};

export const likeItems = async (req,res) =>{

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
      item.likes = item.likes.filter(id => id !== userId);  // ลบ userId ออกจากอาร์เรย์ likes
      await item.save();  // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      return res.status(200).json({ liked: false });
    } else {
      // หากยังไม่ไลค์, ทำการ "ไลค์"
      item.likes.push(userId);  // เพิ่ม userId ไปยังอาร์เรย์ likes
      await item.save();  // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      return res.status(200).json({ liked: true });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error processing request");
  }

};

export const deleteItem = async (req, res) => {
  const { id } = req.params;  // Assuming you pass the item ID via the URL

  try {
    const deletedItem = await Item.findByIdAndDelete(id);  // Delete item by ID

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });  // Item not found
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
  // WARNING: you are not allowed to query all items and do something to filter it afterward.
  // Otherwise, you will be punished by -0.5 scores for this part
  // res.status(501).send("Unimplemented");
};