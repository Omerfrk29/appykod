import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

export interface LocalizedText {
    tr: string;
    en: string;
}

export interface FAQ {
    question: LocalizedText;
    answer: LocalizedText;
}

export interface Pricing {
    startingFrom: string;
    currency: string;
}

export interface Service {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
    fullDescription?: LocalizedText;
    features?: LocalizedText[];
    gallery?: string[];
    faq?: FAQ[];
    pricing?: Pricing;
}

export interface Project {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    imageUrl: string;
    link: string;
    fullDescription?: LocalizedText;
    technologies?: string[];
    challenges?: LocalizedText;
    solutions?: LocalizedText;
    gallery?: string[];
}

export interface Message {
    id: string;
    name: string;
    email: string;
    content: string;
    date: string;
    read?: boolean;
}

export interface SiteSettings {
    siteName: LocalizedText;
    siteDescription: LocalizedText;
    logo: string;
    contact: {
        phone: string;
        email: string;
        address: LocalizedText;
    };
    social: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        github?: string;
    };
}

export interface DBData {
    services: Service[];
    projects: Project[];
    messages: Message[];
    settings?: SiteSettings;
}

const defaultSettings: SiteSettings = {
    siteName: { tr: 'Appykod', en: 'Appykod' },
    siteDescription: { tr: 'Dijital çözümler', en: 'Digital solutions' },
    logo: '/logos/Appy_white.svg',
    contact: {
        phone: '+90 555 123 4567',
        email: 'info@appykod.com',
        address: { tr: 'İstanbul, Türkiye', en: 'Istanbul, Turkey' }
    },
    social: {}
};

const defaultData: DBData = {
    services: [],
    projects: [],
    messages: [],
    settings: defaultSettings,
};

let cached: { mtimeMs: number; data: DBData } | null = null;
let writeChain: Promise<void> = Promise.resolve();

async function ensureDbFileExists(): Promise<void> {
  try {
    await fs.promises.access(DB_PATH, fs.constants.F_OK);
  } catch {
    await fs.promises.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

async function readDbFile(): Promise<DBData> {
  await ensureDbFileExists();
  const raw = await fs.promises.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw) as DBData;
}

export async function getDB(): Promise<DBData> {
  await ensureDbFileExists();
  try {
    const stat = await fs.promises.stat(DB_PATH);
    if (cached && cached.mtimeMs === stat.mtimeMs) return cached.data;
    const data = await readDbFile();
    // Ensure settings exist
    if (!data.settings) {
      data.settings = defaultSettings;
    }
    cached = { mtimeMs: stat.mtimeMs, data };
    return data;
  } catch {
    // If stat/read fails for any reason, fall back to default
    return defaultData;
  }
}

async function atomicWrite(json: string): Promise<void> {
  const tmpPath = `${DB_PATH}.tmp`;
  await fs.promises.writeFile(tmpPath, json, 'utf8');
  // On Windows, rename over existing can fail; copyFile overwrites.
  await fs.promises.copyFile(tmpPath, DB_PATH);
  await fs.promises.unlink(tmpPath).catch(() => {});
}

export async function saveDB(data: DBData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  writeChain = writeChain.then(async () => {
    await atomicWrite(json);
    const stat = await fs.promises.stat(DB_PATH);
    cached = { mtimeMs: stat.mtimeMs, data };
  });
  await writeChain;
}

// Helper function to get localized text
export function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}
