const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This references the User model
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // This references the Project model
      required: true,
    },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Comment", commentSchema);