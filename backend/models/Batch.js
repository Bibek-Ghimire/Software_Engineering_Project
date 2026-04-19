import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    interests: { type: [String], default: [] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxSize: { type: Number, default: 10 },
    allocationAlgorithm: {
      type: String,
      enum: ["kmeans", "hierarchical", "greedy", "dbscan", "spectral"],
      default: "kmeans",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
