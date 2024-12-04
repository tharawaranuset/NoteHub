import Item from "../models/itemModel.js";
import path from "path";
import fs from "fs/promises"; 

export const downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).send("Item not found");

    const fileName = item.fileName;
    const filePath = path.resolve("..", "backend", "res", "uploads", fileName);
    console.log(filePath);
    await fs.access(filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error during file download:", err);
        if (!res.headersSent) {
          res.status(500).send("Error downloading the file.");
        }
      }
    });
  } catch (err) {
    console.error("File not found:", err);
    res.status(404).send("File not found.");
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).send("Item not found");

    const fileName = item.fileName;
    const filePath = path.resolve("..", "backend", "res", "uploads", fileName);

    // เช็คว่ามีไฟล์หรือเปล่า ถ้ามีก็ลบ
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      res.send(`File ${fileName} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting file:", err.message);
      return res.status(404).send("File not found or already deleted.");
    }
  } catch (err) {
    console.error("Error in deleteFile:", err.message);
    res.status(500).send("Internal server error.");
  }
};
