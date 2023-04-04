const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  USERNAME: {
    type: String,
  },
  EMAIL: {
    type: String,

    unique: true,
  },
  PASSWORD: {
    type: String,

    unique: true,
  },
});

schema.pre("save", async function (next) {
  this.PASSWORD = await bcrypt.hash(this.PASSWORD, 10);
  next();
});
module.exports = mongoose.model("authentication", schema);
