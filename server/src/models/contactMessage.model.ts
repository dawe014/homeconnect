import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
}

const ContactMessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);
export default ContactMessage;
