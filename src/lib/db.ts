import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

export interface FAQ {
    question: string;
    answer: string;
}

export interface Pricing {
    startingFrom: string;
    currency: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    fullDescription?: string;
    features?: string[];
    gallery?: string[];
    faq?: FAQ[];
    pricing?: Pricing;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    fullDescription?: string;
    technologies?: string[];
    challenges?: string;
    solutions?: string;
    gallery?: string[];
}

export interface Message {
    id: string;
    name: string;
    email: string;
    content: string;
    date: string;
}

export interface DBData {
    services: Service[];
    projects: Project[];
    messages: Message[];
}

const defaultData: DBData = {
    services: [],
    projects: [],
    messages: [],
};

export function getDB(): DBData {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveDB(data: DBData) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
