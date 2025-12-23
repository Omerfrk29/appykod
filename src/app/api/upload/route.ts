import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError } from '@/lib/errors';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// SVG removed due to XSS risk - can contain JavaScript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Magic numbers for file type validation
const FILE_SIGNATURES: Record<string, (buffer: Buffer) => boolean> = {
  'image/jpeg': (buf) => buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF,
  'image/png': (buf) => buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])),
  'image/gif': (buf) => {
    if (buf.length < 6) return false;
    const gif87a = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
    const gif89a = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    return buf.subarray(0, 6).equals(gif87a) || buf.subarray(0, 6).equals(gif89a);
  },
  'image/webp': (buf) => {
    // WebP: RIFF (4 bytes) + file size (4 bytes) + WEBP (4 bytes)
    if (buf.length < 12) return false;
    const riff = buf.subarray(0, 4).toString('ascii');
    const webp = buf.subarray(8, 12).toString('ascii');
    return riff === 'RIFF' && webp === 'WEBP';
  },
};

function validateFileContent(buffer: Buffer, expectedType: string): boolean {
  const validator = FILE_SIGNATURES[expectedType];
  if (!validator) return false;
  return validator(buffer);
}

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

export async function POST(request: Request) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('File too large. Maximum size is 10MB');
    }

    await ensureUploadDir();

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate file content (magic number check)
    if (!validateFileContent(buffer, file.type)) {
      throw new ValidationError('File content does not match declared type');
    }

    // Validate file extension
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
      throw new ValidationError('Invalid file extension');
    }

    // Generate unique filename with validated extension
    const filename = `${uuidv4()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const { filename } = body as { filename?: string };

    if (!filename || typeof filename !== 'string') {
      throw new ValidationError('Filename required');
    }

    // Security: prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, sanitizedFilename);

    const { unlink } = await import('fs/promises');
    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

