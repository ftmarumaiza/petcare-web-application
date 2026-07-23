const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String, // cloudinary url
      default: "",
    },
    imagePublicId: {
      type: String, // needed to delete from cloudinary later
      default: "",
    },
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, "Pet breed is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Pet age is required"],
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Unknown"],
      default: "Unknown",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
