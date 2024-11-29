import express from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import Item from "../models/itemModel.js";

import * as fileController from "../controllers/fileController.js";
const router = express.Router();

router.post("/upload/:id/", upload.single("file"),async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    try {
        const id = req.params;
        const item = await Item.findById(id);
        const file = req.file;

        // const filename = (file.filename);
        // const filetype = (file.type);
        // const filepath = (file.path);
        
        if (!item) return res.status(404).send("Item not found");
    
        item.file.name= "";
        item.file.type= "filetype";
        item.file.path= "filepath" ;

        await item.save();

        // res.send(`File uploaded successfully: ${req.file.filename}`);
        res.status(200).json({ message: "Item updated successfully", item });
      } catch (err) {
        res.status(500).send("Error updating item");
      }
   

});

// Endpoint to download a file
router.get("/download/:id", fileController.downloadFile);
router.delete("/delete/:id", fileController.deleteFile);


export default router;
