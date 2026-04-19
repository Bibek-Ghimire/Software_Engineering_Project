import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: String }], // array of names
    memberCount: { type: Number, default: 1 },
    courseDetail: { type: String },
    keywords: [{ type: String }], // For recommendation matching
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
