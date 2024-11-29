import express from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import Item from "../models/itemModel.js";

const router = express.Router();

router.post("/upload/:id", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    Item.findById(req.file.id).
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

import path from "path";
import fs from "fs";


// Endpoint to download a file
router.get("/download/:filename", (req, res) => {
    const filename = req.params.filename; // Get filename from URL
    const filePath = path.join(__dirname, "./res/uploads/", filename); // Construct file path

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
});


export default router;
