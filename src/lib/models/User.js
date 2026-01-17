import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    enum: ["user", "sudo"],
    default: "user",
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
    validate: {
      validator: function (val) {
        if (this.role === "sudo" && val !== null) return false;
        return true;
      },
      message: "Admins cant join team",
    },
  },

  solvedChallenges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
    
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.role === "sudo") {
    this.team = null;
  }

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
