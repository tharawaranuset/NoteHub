import Item from "../models/itemModel.js";
import path from "path";
import fs from "fs";

export const downloadFile = async (req, res) => {
    const filename = req.params.filename; // Get filename from URL
    const filePath = path.join("./res/uploads/", filename); // Construct file path

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send("File not found.");
        }
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error during file download:", err);
                res.status(500).send("Error downloading the file.");
            }
        });
    });
    res.status(200).json(filename);

}


export const deleteFile = async (req, res) => {
  const filename = req.params.filename; // Get filename from URL
  const filePath = path.join(__dirname, "./res/uploads/", filename); // Construct file path

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
