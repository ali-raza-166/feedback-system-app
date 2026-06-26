import { Schema, model, models } from "mongoose";

const resetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const ResetToken = models.ResetToken || model("ResetToken", resetTokenSchema);
export default ResetToken;
