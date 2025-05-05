// src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import { config } from '../../config/index.js';
import { redis } from '../../config/cache.js';

const repo = new AuthRepository();
const SECRET: Secret = config.JWT_SECRET;

// helper: convert '1h','7d' → seconds number
function toSeconds(ttl: string): number {
  const match = ttl.match(/^(\d+)(s|m|h|d)$/);
  if (!match) throw new Error('Invalid TTL format');
  const [_, num, unit] = match;
  const n = parseInt(num, 10);
  switch (unit) {
    case 's': return n;
    case 'm': return n * 60;
    case 'h': return n * 3600;
    case 'd': return n * 86400;
    default:  return n;
  }
}

export class AuthService {
  static async register(email: string, password: string) {
    if (await repo.findByEmail(email)) {
      throw new Error('Email already registered');
    }
    const hash = await bcrypt.hash(password, 12);
    return repo.create({ email, password: hash, role: 'user' });
  }

  static async login(email: string, password: string) {
    const user = await repo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const accessOpts: SignOptions  = { expiresIn: toSeconds(config.JWT_EXPIRES_IN) };
    const refreshOpts: SignOptions = { expiresIn: toSeconds(config.JWT_REFRESH_EXPIRES_IN) };

    const accessToken  = jwt.sign(payload, SECRET, accessOpts);
    const refreshToken = jwt.sign(payload, SECRET, refreshOpts);

    // store refresh token in Redis
    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', toSeconds(config.JWT_REFRESH_EXPIRES_IN));

    return { accessToken, refreshToken };
  }

  static async refresh(token: string) {
    const decoded = jwt.verify(token, SECRET) as { sub: string };
    const stored = await redis.get(`refresh:${decoded.sub}`);
    if (stored !== token) throw new Error('Invalid refresh token');

    const newAccess  = jwt.sign({ sub: decoded.sub }, SECRET, { expiresIn: toSeconds(config.JWT_EXPIRES_IN) });
    const newRefresh = jwt.sign({ sub: decoded.sub }, SECRET, { expiresIn: toSeconds(config.JWT_REFRESH_EXPIRES_IN) });

    await redis.set(`refresh:${decoded.sub}`, newRefresh, 'EX', toSeconds(config.JWT_REFRESH_EXPIRES_IN));

    return { accessToken: newAccess, refreshToken: newRefresh };
  }
}
