const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'secret123';
const SALT_ROUNDS = 12; 

async function getPasswordHash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

function createAccessToken(data) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: '30d' });
}

module.exports = {
  getPasswordHash,
  verifyPassword,
  createAccessToken,
};
