import express from "express";
import dotenv from "dotenv";
import geminiRouter from "./routes/geminiRoute";
import cors from "cors";
// import serverlessExpress from "@codegenie/serverless-express";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const apiRoute = "/api/v1";

app.use(cors());
app.use(express.json());
app.use(`${apiRoute}/gemini`, geminiRouter);

app.get("/", (req, res) => {
  res.json({
    msg: "Healthy server!",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

export default app;
// export const handler = serverlessExpress({ app });
