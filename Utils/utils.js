import { studentModel } from "../Db-utils/model.js";

const validate = async (model, obj) => {
  let isValid = false;
  try {
    await new model(obj).validate();
    isValid = !isValid;
    return { isValid };
  } catch (err) {
    console.log(err);
    return { err, isValid };
  }
};

const assignMentorToStudent = async (arr, mentorId) => {
  try {
    await studentModel.updateMany(
      { id: { $in: [...arr] } },
      { $set: { currentMentorId: mentorId } }
    );
    console.log(
      `Mentor (id : ${mentorId}) assigned to students (id : ${arr}) successfully`
    );
  } catch (error) {
    console.log(error);
  }
};

const checkForMentor = async (arr) => {
  const studentsWithoutMentor = await studentModel.find({ currentMentorId: 0 });
  // console.log(studentsWithoutMentor);
  for (let i = 0; i < arr.length; i++) {
    let isMentor = false;
    for (let j = 0; j < studentsWithoutMentor.length; j++) {
      if (arr[i] == studentsWithoutMentor[j].id) {
        isMentor = true;
        break;
      }
    }
    if (!isMentor) {
      return false;
    }
  }
  return true;
};
export { validate, assignMentorToStudent, checkForMentor };
