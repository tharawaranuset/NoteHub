import express from "express";
import cors from "cors";

import ItemRoute from "./routes/itemRoute.js";
import MemberRoute from "./routes/memberRoute.js";
import LikeRoute from "./routes/likeRoute.js";
import commentRoutes from "./routes/itemRoute.js";
const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/items", ItemRoute);
app.use("/members", MemberRoute);
app.use("/likes", LikeRoute);
export default app;
