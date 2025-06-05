const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    goalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ['Technology','Agriculture','Education','Arts & Culture','Healthcare','Environment','Community'],
      default: "other",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // You can enable this later once donations are implemented
    /*
    donations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    }],
    */

    isPublished: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // for admin moderation
    },

    deadline: {
      type: Date,
      required: true,
    },

    currentAmount: {
      type: Number,
      default: 0, // updated when donations happen
    },
    backers :{
    type: Number,
    default: 0, // Start at 0 for new projects
},
  },
  { timestamps: true }


  
);

module.exports = mongoose.model("Project", projectSchema);
