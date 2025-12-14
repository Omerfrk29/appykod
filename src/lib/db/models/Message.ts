import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  name: string;
  email: string;
  content: string;
  date: Date;
  read?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MessageSchema.index({ id: 1 });
MessageSchema.index({ email: 1 });
MessageSchema.index({ date: -1 });

const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
