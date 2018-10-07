import mongoose = require("mongoose");

export type LogModel = mongoose.Document & {
  logId: string;
};

const logSchema = new mongoose.Schema({
  logId: { type: String, unique: true }
});

const Log = mongoose.model<LogModel>("Log", logSchema);
export default Log;
