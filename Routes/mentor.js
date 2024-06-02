import express from "express";
import { mentorModel, studentModel } from "../Db-utils/model.js";
import { decreaseSequenceValue, getNextSequenceValue } from "./counter.js";
import {
  assignMentorToStudent,
  checkForMentor,
  validate,
} from "../Utils/utils.js";

const mentorRouter = express.Router();

mentorRouter.post("/", async (req, res) => {
  const { body } = req;
  let { isValid, err } = await validate(mentorModel, body);
  if (!isValid) {
    res.status(400).send({ msg: err?.message });
  } else {
    try {
      const newMentor = {
        id: await getNextSequenceValue("mentorId"),
        ...body,
      };
      await mentorModel.create({ ...newMentor });
      res.status(201).send({ msg: "Mentor created" });
    } catch (e) {
      await decreaseSequenceValue("mentorId");
      // console.log(e);
      let statusCode = 0;
      if (e.message) statusCode = 400;
      res
        .status(statusCode || 500)
        .send({ msg: e.message || "Something went wrong" });
    }
  }
});

mentorRouter.get("/", async (req, res) => {
  try {
    const mentors = await mentorModel.find({});
    // console.log(students);
    res.send(mentors);
  } catch (e) {
    console.log(e);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

mentorRouter.put("/assign-students/:id", async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  //   console.log(body, id);
  let stu = await checkForMentor(body.studentsId);
  // console.log(stu);
  if (!stu) {
    res.status(400).send({
      msg: "One or more studnets already assigned to mentor or Invalid Student ID",
    });
  } else {
    try {
      await mentorModel.updateOne(
        { id },
        { $addToSet: { studentsId: { $each: body.studentsId } } }
      );
      await assignMentorToStudent(body.studentsId, id);
      res.send({ msg: "Students assigned successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Something went wrong" });
    }
  }
});

export default mentorRouter;
