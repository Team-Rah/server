const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
    },
    score: {
        type: Number,
        default: 0
    },
    friends: [
        {
            type: String,
            ref: 'User'
        }
    ],
    validated: {
        type: Boolean,
        default: false,
    },
    img: {
        type: String,
    },
    createdAt: {
        type: String,
        default: () => Date.now(),
    },
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);