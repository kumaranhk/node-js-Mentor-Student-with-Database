import mongoose from "mongoose";
const mentorSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  studentsId: {
    type: Array,
    required: false,
  },
});

const studentSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  currentMentorId: Number,
  previousMentorId: Number,
});

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence_value: {
    type: Number,
    required: true,
  },
});

// Model creation using schema
const mentorModel = new mongoose.model("Mentor", mentorSchema, "mentors");
const studentModel = new mongoose.model("Student", studentSchema, "students");
const counterModel = new mongoose.model("counter", counterSchema, "counter");

export { mentorModel, studentModel, counterModel };
