import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["enrollment", "course_update", "message", "announcement"],
      default: "announcement",
    },
    relatedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    relatedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
