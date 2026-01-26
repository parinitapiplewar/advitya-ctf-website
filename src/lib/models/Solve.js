import mongoose from "mongoose";

const SolveSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    index: true,
  },

  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
    index: true,
  },

  points: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

SolveSchema.index({ team: 1, challenge: 1 }, { unique: true });

export default mongoose.models.Solve ||
  mongoose.model("Solve", SolveSchema);
