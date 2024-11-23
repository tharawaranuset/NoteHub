
import express from "express";
import cors from "cors";

import ItemRoute from "./routes/itemRoute.js";
import MemberRoute from "./routes/memberRoute.js";
import commentRoutes from "./routes/commentRoute.js";
// import commentRoutes from "./routes/itemRoute.js"; // never used
const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/items", ItemRoute);
app.use("/members", MemberRoute);
app.use("/comments", commentRoutes);
export default app;
