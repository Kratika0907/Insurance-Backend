import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Not availabel"],
    default: "Not availabel",
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West", "Not availabel"],
    default: "Not availabel",
    required: true,
  },
  income: {
    type: String,
    required: true,
  },
});
//customerSchema.index({ customerId: 1 }, { unique: true });

export const Customer = mongoose.model("customer", customerSchema);
