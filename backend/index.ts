import express from "express";
import cookieParser from "cookie-parser";

import * as routes from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Leetlab backend server says Hi!");
});

app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/problems", routes.problemRouter);
app.use("/api/v1/execute-code", routes.executeCodeRouter);
app.use("/api/v1/submissions", routes.submissionRouter);
app.use("/api/v1/playlists", routes.playlistRouter);

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  console.log("Server runnning on PORT:", PORT);
});
