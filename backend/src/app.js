import express from "express";
import cors from "cors";

import ItemRoute from "./routes/itemRoute.js";
import MemberRoute from "./routes/memberRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import fileRoute from "./routes/fileRoute.js";

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./res/uploads/"));

// อนุญาติให้ใช้งานจากหลายแหล่ง (จาก frontend ที่พอร์ตต่างกัน)
app.use(cors());

// routes
app.use("/items", ItemRoute);
app.use("/members", MemberRoute);
app.use("/comments", commentRoutes);
app.use("/file", fileRoute);

export default app;
