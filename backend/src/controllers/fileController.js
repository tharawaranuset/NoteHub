import Item from "../models/itemModel.js";
import path from "path";
import fs from 'fs/promises'; // Ensure fs.promises is used for async operations


export const downloadFile = async (req, res) => {
    const { id } = req.params;

    try {
      const item = await Item.findById(id);
      if (!item) return res.status(404).send("Item not found");
    
      const fileName = item.fileName;
      const filePath = path.resolve( '..', 'backend', 'res', 'uploads', fileName);
      console.log(filePath);
      await fs.access(filePath);
      
      // If the file exists, send it
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

}


export const deleteFile = async (req, res) => {
  const filename = req.params.filename; // Get filename from URL
  const filePath = path.join("./res/uploads/", filename); // Construct file path

  // Check if the file exists and delete it
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
          return res.status(404).send("File not found.");
      }
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error("Error deleting file:", err);
              return res.status(500).send("Error deleting the file.");
          }
          res.send(`File ${filename} deleted successfully.`);
      });
  });
}
