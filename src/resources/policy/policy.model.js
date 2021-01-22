import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
      immutable: true,
    },
    fuel: String,
    premium: {
      type: Number,
      required: true,
    },
    vehicleSegment: {
      type: String,
    },
    bodilyInjuryLiability: {
      type: Boolean,
      required: true,
    },
    personalInjuryProtection: {
      type: Boolean,
      required: true,
    },
    propertyDamageLiability: {
      type: Boolean,
      required: true,
    },
    collision: {
      type: Boolean,
      required: true,
    },
    comprehensive: {
      type: Boolean,
      required: true,
    },
    customer: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model("policy", policySchema);
