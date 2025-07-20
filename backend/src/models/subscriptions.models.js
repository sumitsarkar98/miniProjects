// importing modules
import mongoose, { Schema } from "mongoose";

// create mongoose schema
const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // to who  subscribed
      ref: "User",
    },
  },
  { timestamps: true }
);

//export
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
