// src/shared/pagination.ts
import { Request } from 'express';
import { config } from '../config';

export interface PageOptions {
  page: number;
  limit: number;
  skip: number;
}

export function getPageOptions(req: Request): PageOptions {
  const page = Math.max(parseInt(req.query.page as string) || config.DEFAULT_PAGE, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || config.DEFAULT_LIMIT, config.MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
