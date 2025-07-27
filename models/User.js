const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
});

// pre-save middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only has if password changed
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
