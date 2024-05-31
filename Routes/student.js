import express from "express";
import { mentorModel, studentModel } from "../Db-utils/model.js";
import { getNextSequenceValue, decreaseSequenceValue } from "./counter.js";
import { validate } from "../Utils/utils.js";

const studentRouter = express.Router();

studentRouter.post("/", async (req, res) => {
  const { body } = req;
  let { isValid, err } = await validate(studentModel, body);
  if (!isValid) {
    res.status(400).send({ msg: err?.message });
  } else {
    try {
      const newStudent = {
        id: await getNextSequenceValue("studentId"),
        ...body,
        currentMentorId: 0,
        previousMentorId: 0,
      };
      await studentModel.create({ ...newStudent });
      console.log(`Student Created with deatails ${{ ...newStudent }}`);
      res.status(201).send({ msg: "Student created" });
    } catch (e) {
      await decreaseSequenceValue("studentId");
      // console.log(e);
      let statusCode = 0;
      if (e.message) statusCode = 400;
      res
        .status(statusCode || 500)
        .send({ msg: e.message || "Something went wrong" });
    }
  }
});

studentRouter.get("/", async (req, res) => {
  try {
    const students = await studentModel.find({});
    // console.log(students);
    res.send(students);
  } catch (e) {
    console.log(e);
    res.send("error");
  }
});

studentRouter.put("/assign-mentor/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    let student = await studentModel.findOne({ id });
    // console.log(student);
    if (student.currentMentorId) {
      await mentorModel.updateOne(
        { id: student.currentMentorId },
        { $pull: { students: parseInt(id) } }
      );
      console.log(
        `Student (id : ${id}) removed from the mentor (id : ${body.mentorId})`
      );
    }
    await studentModel.updateOne(
      { id },
      {
        $set: {
          currentMentorId: body.mentorId,
          previousMentorId: student.currentMentorId,
        },
      }
    );
    await mentorModel.updateOne(
      { id: body.mentorId },
      { $addToSet: { students: parseInt(id) } }
    );
    console.log(
      `Mentor (id : ${body.mentorId}) is assigned to the student (id : ${id})`
    );
    res.send({ msg: "Mentor assigned to the requested Student" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

studentRouter.get("/previous-mentor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let result = await studentModel.aggregate([
      {
        $lookup: {
          from: "mentors",
          localField: "previousMentorId",
          foreignField: "id",
          as: "prevoius_mentor_details",
        },
      },
      {
        $match: { id: parseInt(id) },
      },
      {
        $unwind: "$prevoius_mentor_details",
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          previous_mentor_details: {
            __v: 0,
          },
        },
      },
    ]);
    res.send(
      result.length == 0
        ? {
            msg: "Requested student does not contain any previous mentor",
          }
        : result
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Something went wrong" });
  }
});
export default studentRouter;
