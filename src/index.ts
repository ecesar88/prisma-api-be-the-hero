import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routes";

const app = express();

dotenv.config();
app.use(morgan("dev"));

const PORT = process.env.PORT;

app.use(express.json());

app.use(router);

app.listen(PORT || 5000, () => {
  console.log(`[SERVER] - Server up and running on PORT ${PORT}`);
});
