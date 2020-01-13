const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalSchema = new Schema({
  ObjectId: String
});

module.exports = mongoose.model("Historical", historicalSchema);
