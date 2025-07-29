const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    required: true,
  },

  description: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Skill", skillSchema);
