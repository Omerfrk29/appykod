import connectDB from '@/lib/db/mongodb';
import MessageModel, { IMessage } from '@/lib/db/models/Message';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '@/lib/db';

export async function getAllMessages(): Promise<Message[]> {
  await connectDB();
  const messages = await MessageModel.find({})
    .sort({ date: -1 })
    .lean();
  return messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    content: m.content,
    date: m.date.toISOString(),
    read: m.read,
  }));
}

export async function getMessageById(id: string): Promise<Message | null> {
  await connectDB();
  const message = await MessageModel.findOne({ id }).lean();
  if (!message) return null;
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    content: message.content,
    date: message.date.toISOString(),
    read: message.read,
  };
}

export async function createMessage(
  messageData: Omit<Message, 'id' | 'date'>
): Promise<Message> {
  await connectDB();
  const id = uuidv4();
  const message = new MessageModel({
    id,
    ...messageData,
    date: new Date(),
  });
  await message.save();
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    content: message.content,
    date: message.date.toISOString(),
    read: message.read,
  };
}

export async function markMessageAsRead(id: string): Promise<Message | null> {
  await connectDB();
  const message = await MessageModel.findOneAndUpdate(
    { id },
    { $set: { read: true } },
    { new: true }
  ).lean();
  if (!message) return null;
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    content: message.content,
    date: message.date.toISOString(),
    read: message.read,
  };
}

export async function deleteMessage(id: string): Promise<boolean> {
  await connectDB();
  const result = await MessageModel.deleteOne({ id });
  return result.deletedCount > 0;
}
