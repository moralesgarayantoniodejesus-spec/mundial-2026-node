/**
 * Authentication module - Password hashing and JWT tokens
 */
const crypto = require('crypto');
const os = require('os');

const SECRET_KEY = process.env.JWT_SECRET || ('mundial2026_secret_change_in_production_' + crypto.randomBytes(16).toString('hex'));

/**
 * Hash a password with PBKDF2
 * @param {string} password - The password to hash
 * @param {string} salt - Optional salt, generated if not provided
 * @returns {Array} [hash, salt]
 */
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hashed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
  return [hashed.toString('base64'), salt];
}

/**
 * Verify a password against a hash
 * @param {string} password - The password to verify
 * @param {string} passwordHash - The stored hash
 * @param {string} salt - The stored salt
 * @returns {boolean}
 */
function verifyPassword(password, passwordHash, salt) {
  const hashed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
  return hashed.toString('base64') === passwordHash;
}

/**
 * Base64url encode
 */
function b64urlEncode(data) {
  return Buffer.from(data).toString('base64url');
}

/**
 * Base64url decode
 */
function b64urlDecode(str) {
  // Add padding if necessary
  const padding = (4 - (str.length % 4)) % 4;
  const padded = str + '='.repeat(padding);
  return Buffer.from(padded, 'base64url');
}

/**
 * Create a JWT token
 */
function createToken(userId, email, role, nickname) {
  const header = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payloadData = { user_id: userId, email, role, nickname, exp: now + (86400 * 7) };
  const payload = b64urlEncode(JSON.stringify(payloadData));
  const signature = b64urlEncode(crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSig = b64urlEncode(crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${payload}`).digest());
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const payloadData = JSON.parse(b64urlDecode(payload).toString());
    if ((payloadData.exp || 0) < Math.floor(Date.now() / 1000)) return null;
    return payloadData;
  } catch (err) { return null; }
}

module.exports = { hashPassword, verifyPassword, createToken, verifyToken, SECRET_KEY };
