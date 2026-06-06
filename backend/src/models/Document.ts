import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  chunks: [chunkSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Document", documentSchema);
