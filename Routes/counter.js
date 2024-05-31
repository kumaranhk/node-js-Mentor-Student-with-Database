import { counterModel } from "../Db-utils/model.js";

async function getNextSequenceValue(sequenceName) {
  try {
    const sequenceDocument = await counterModel.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true, useFindAndModify: false }
    );
    return sequenceDocument.sequence_value;
  } catch (e) {
    console.error("Error getting next sequence value:", e);
    throw e;
  }
}
async function decreaseSequenceValue(sequenceName) {
  try {
    const sequenceDocument = await counterModel.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: -1 } },
      { new: true, upsert: true, useFindAndModify: false }
    );
    return sequenceDocument.sequence_value;
  } catch (e) {
    console.error("Error getting next sequence value:", e);
    throw e;
  }
}

export { getNextSequenceValue, decreaseSequenceValue };
