import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true }, // student's name or id
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);
