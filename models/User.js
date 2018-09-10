const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema. What are our users going to have:
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Export (users and Schema)
module.exports = user = mongoose.model("users", UserSchema);
