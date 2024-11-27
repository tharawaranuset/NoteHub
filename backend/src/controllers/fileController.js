import path from "path";
import multer from "multer";
import express from "express";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./res/uploads/");
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + ext);
    },
});

// var upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         if(
//             file.mimetype == "image/png" ||
//             file.mimetype == "image/jpg" 
//         ){
//             cb(null,true);
//         }else{
//             console.log("only jpg & png file supported");
//             cb(null, false);
//         }
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2, 
//     }
// });
const app = express();

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
  });
export default upload;