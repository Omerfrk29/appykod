import crypto from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash:admin-password -- <password>');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const n = 16384;
const r = 8;
const p = 1;
const keyLen = 64;

const hash = crypto.scryptSync(password, salt, keyLen, { N: n, r, p, maxmem: 128 * 1024 * 1024 });
console.log(`scrypt:${n}:${r}:${p}:${salt.toString('base64')}:${hash.toString('base64')}`);


