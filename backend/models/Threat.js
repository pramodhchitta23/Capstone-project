const mongoose = require("mongoose");

const threatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: String,
    prediction: String,
    probability: Number,
    severity: String,
    recommendation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Threat", threatSchema);