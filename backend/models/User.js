import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
