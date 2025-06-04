const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,select: false },
  socketId: { type: String },
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;