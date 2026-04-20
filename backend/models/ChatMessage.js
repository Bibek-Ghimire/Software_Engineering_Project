import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        readAt: Date,
      },
    ],
  },
  { timestamps: true },
);

// Index for efficient querying
chatMessageSchema.index({ course: 1, timestamp: -1 });
chatMessageSchema.index({ sender: 1, course: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
