#!/usr/bin/env node

/**
 * Migration script to migrate data from data.json to MongoDB.
 * Run with: node scripts/migrate-to-mongodb.mjs
 * 
 * Reads MONGODB_URI from .env file or environment variables.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // Try default .env location
}

const DATA_PATH = path.join(__dirname, '..', 'data.json');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'appykod';

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.error('Please set it before running the migration:');
  console.error('  export MONGODB_URI="mongodb://localhost:27017/appykod"');
  console.error('  node scripts/migrate-to-mongodb.mjs');
  process.exit(1);
}

// Import models (we need to define them inline since we can't import from TypeScript)
const LocalizedTextSchema = new mongoose.Schema(
  {
    tr: { type: String, required: true },
    en: { type: String, required: true },
  },
  { _id: false }
);

const FAQSchema = new mongoose.Schema(
  {
    question: { type: LocalizedTextSchema, required: true },
    answer: { type: LocalizedTextSchema, required: true },
  },
  { _id: false }
);

const PricingSchema = new mongoose.Schema(
  {
    startingFrom: { type: String, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    icon: { type: String, default: 'code' },
    fullDescription: { type: LocalizedTextSchema, required: false },
    features: [{ type: LocalizedTextSchema }],
    gallery: [{ type: String }],
    faq: [{ type: FAQSchema }],
    pricing: { type: PricingSchema, required: false },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, default: '#' },
    fullDescription: { type: LocalizedTextSchema, required: false },
    technologies: [{ type: String }],
    challenges: { type: LocalizedTextSchema, required: false },
    solutions: { type: LocalizedTextSchema, required: false },
    gallery: [{ type: String }],
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: LocalizedTextSchema, required: true },
    siteDescription: { type: LocalizedTextSchema, required: true },
    logo: { type: String, required: true },
    contact: {
      email: { type: String, required: true },
      address: { type: LocalizedTextSchema, required: true },
    },
    social: {
      twitter: { type: String, required: false },
      linkedin: { type: String, required: false },
      instagram: { type: String, required: false },
      github: { type: String, required: false },
    },
    sessionSecret: { type: String, required: false },
  },
  { timestamps: true }
);

SettingsSchema.index({}, { unique: true });

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure only one admin user exists
AdminSchema.index({}, { unique: true });

const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function migrate() {
  console.log('Starting MongoDB migration...');
  console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
  console.log(`Database: ${MONGODB_DB_NAME}`);

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    console.log('Connected to MongoDB successfully');

    // Read data.json
    console.log('Reading data.json...');
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(raw);

    // Migrate Services
    if (data.services && data.services.length > 0) {
      console.log(`Migrating ${data.services.length} services...`);
      for (const service of data.services) {
        try {
          await ServiceModel.findOneAndUpdate(
            { id: service.id },
            service,
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error migrating service ${service.id}:`, error.message);
        }
      }
      console.log('Services migrated successfully');
    } else {
      console.log('No services to migrate');
    }

    // Migrate Projects
    if (data.projects && data.projects.length > 0) {
      console.log(`Migrating ${data.projects.length} projects...`);
      for (const project of data.projects) {
        try {
          await ProjectModel.findOneAndUpdate(
            { id: project.id },
            project,
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error migrating project ${project.id}:`, error.message);
        }
      }
      console.log('Projects migrated successfully');
    } else {
      console.log('No projects to migrate');
    }

    // Migrate Messages
    if (data.messages && data.messages.length > 0) {
      console.log(`Migrating ${data.messages.length} messages...`);
      for (const message of data.messages) {
        try {
          const messageData = {
            ...message,
            date: message.date ? new Date(message.date) : new Date(),
          };
          await MessageModel.findOneAndUpdate(
            { id: message.id },
            messageData,
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error migrating message ${message.id}:`, error.message);
        }
      }
      console.log('Messages migrated successfully');
    } else {
      console.log('No messages to migrate');
    }

    // Migrate Settings
    if (data.settings) {
      console.log('Migrating settings...');
      try {
        await SettingsModel.findOneAndUpdate(
          {},
          data.settings,
          { upsert: true, new: true }
        );
        console.log('Settings migrated successfully');
      } catch (error) {
        console.error('Error migrating settings:', error.message);
      }
    } else {
      console.log('No settings to migrate, creating default settings...');
      const defaultSettings = {
        siteName: { tr: 'Appykod', en: 'Appykod' },
        siteDescription: { tr: 'Dijital çözümler', en: 'Digital solutions' },
        logo: '/logos/Appy_white.svg',
        contact: {
          email: 'info@appykod.com',
          address: { tr: 'İstanbul, Türkiye', en: 'Istanbul, Turkey' },
        },
        social: {},
      };
      await SettingsModel.findOneAndUpdate({}, defaultSettings, { upsert: true });
      console.log('Default settings created');
    }

    // Ensure session secret exists in settings
    const settings = await SettingsModel.findOne();
    if (!settings || !settings.sessionSecret) {
      console.log('Creating session secret...');
      const sessionSecret = crypto.randomBytes(32).toString('base64');
      await SettingsModel.findOneAndUpdate(
        {},
        { sessionSecret },
        { upsert: true }
      );
      console.log('Session secret created');
    }

    // Create or update admin user
    console.log('Setting up admin user...');
    const adminUsername = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || '6k*vc3ozADNFBiT*Lq24';
    
    // Hash password using scrypt (same as auth.ts)
    function hashPassword(plain) {
      const salt = crypto.randomBytes(16);
      const n = 16384;
      const r = 8;
      const p = 1;
      const keyLen = 64;
      const hash = crypto.scryptSync(plain, salt, keyLen, { N: n, r, p, maxmem: 128 * 1024 * 1024 });
      return `scrypt:${n}:${r}:${p}:${salt.toString('base64')}:${hash.toString('base64')}`;
    }

    const passwordHash = hashPassword(adminPassword);
    await AdminModel.findOneAndUpdate(
      {},
      { username: adminUsername, passwordHash },
      { upsert: true, new: true }
    );
    console.log(`Admin user '${adminUsername}' created/updated successfully`);

    // Summary
    const serviceCount = await ServiceModel.countDocuments();
    const projectCount = await ProjectModel.countDocuments();
    const messageCount = await MessageModel.countDocuments();
    const settingsCount = await SettingsModel.countDocuments();
    const adminCount = await AdminModel.countDocuments();

    console.log('\nMigration completed successfully!');
    console.log('Summary:');
    console.log(`  - Services: ${serviceCount}`);
    console.log(`  - Projects: ${projectCount}`);
    console.log(`  - Messages: ${messageCount}`);
    console.log(`  - Settings: ${settingsCount}`);
    console.log(`  - Admin users: ${adminCount}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
