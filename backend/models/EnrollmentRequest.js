import mongoose from "mongoose";

const enrollmentRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true },
);

// Ensure each student can only have one pending request per course
enrollmentRequestSchema.index(
  { student: 1, course: 1, status: 1 },
  { unique: true },
);

export default mongoose.model("EnrollmentRequest", enrollmentRequestSchema);
