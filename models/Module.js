const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  notes: String,
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
});

module.exports = mongoose.model("Module", moduleSchema);
