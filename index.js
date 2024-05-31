import express from "express";
import studentRouter from "./Routes/student.js";
import mongooseConnect from "./Db-utils/mongoose.js";
import mentorRouter from "./Routes/mentor.js";

const app = express();
app.use(express.json());
await mongooseConnect();

app.use("/students", studentRouter);
app.use("/mentors", mentorRouter);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servet listening at port ${PORT}`);
});
