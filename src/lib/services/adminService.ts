import connectDB from '@/lib/db/mongodb';
import AdminModel from '@/lib/db/models/Admin';
import SettingsModel from '@/lib/db/models/Settings';
import { hashPassword, verifyPassword } from '@/lib/auth';
import crypto from 'crypto';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

export interface AdminConfig {
  sessionSecret: string;
}

/**
 * Get admin user from database
 */
export async function getAdmin(): Promise<AdminCredentials | null> {
  await connectDB();
  const admin = await AdminModel.findOne();
  if (!admin) return null;
  return {
    username: admin.username,
    passwordHash: admin.passwordHash,
  };
}

/**
 * Create or update admin user
 */
export async function createOrUpdateAdmin(
  username: string,
  password: string
): Promise<AdminCredentials> {
  await connectDB();
  const passwordHash = hashPassword(password);
  
  const admin = await AdminModel.findOneAndUpdate(
    {},
    { username, passwordHash },
    { upsert: true, new: true }
  );
  
  return {
    username: admin.username,
    passwordHash: admin.passwordHash,
  };
}

/**
 * Verify admin credentials
 */
export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  const admin = await getAdmin();
  if (!admin) return false;
  if (admin.username !== username) return false;
  return verifyPassword(password, admin.passwordHash);
}

/**
 * Get or create session secret
 */
export async function getSessionSecret(): Promise<string> {
  await connectDB();
  const settings = await SettingsModel.findOne();
  
  if (settings?.sessionSecret) {
    return settings.sessionSecret;
  }
  
  // Generate new session secret if not exists
  const sessionSecret = crypto.randomBytes(32).toString('base64');
  await SettingsModel.findOneAndUpdate(
    {},
    { sessionSecret },
    { upsert: true, new: true }
  );
  
  return sessionSecret;
}

/**
 * Update session secret
 */
export async function updateSessionSecret(newSecret: string): Promise<void> {
  await connectDB();
  await SettingsModel.findOneAndUpdate(
    {},
    { sessionSecret: newSecret },
    { upsert: true }
  );
}
