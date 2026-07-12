import jwt from 'jsonwebtoken';

export default function generateToken(userId, tokenVersion = 0) {
  return jwt.sign({ sub: userId, tv: tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
