const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    carType: { type: String },
    tags: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registeredCity: { type: String, required: true },
    registeredNumber: { type: Number, required: true },
    ownerClass: {
      type: String,
      enum: ["First", "Second", "Third", "Fourth", "Other"],
      required: true,
    },
    KmRunning: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
