import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], default: "student" },

    // Teacher-specific fields
    department: { type: String, default: "" },
    qualification: { type: String, default: "" },
    subject: { type: String, default: "" },
    bio: { type: String, default: "" },
    achievements: { type: [String], default: [] },
    profilePicture: { type: String, default: "" },
    resume: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    // Leaderboard-specific fields
    coursesCreated: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    batch: {
      type: String,
      enum: ["Diamond", "Platinum", "Gold", "Silver", "Bronze", "Basic"],
      default: "Basic",
    },

    // Student-specific fields
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    interestedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    college: { type: String, default: "" },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
