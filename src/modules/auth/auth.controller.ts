// src/modules/auth/auth.controller.ts
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

class ValidationException extends Error {
  status = 400;
  details: { property: string; constraints?: Record<string, string> }[];
  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.details = errors.map((e) => ({
      property: e.property,
      constraints: e.constraints,
    }));
  }
}

// Generic validator that throws on failure
async function validateDto<T extends object>(
  DtoClass: ClassConstructor<T>,
  body: unknown
): Promise<T> {
  const dto = plainToInstance(DtoClass, (body as object) ?? {});
  try {
    await validateOrReject(dto);
    return dto;
  } catch (errors) {
    if (Array.isArray(errors) && errors.every((e) => e instanceof ValidationError)) {
      throw new ValidationException(errors as ValidationError[]);
    }
    throw errors;
  }
}

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = await validateDto(RegisterDto, req.body);
    const user = await AuthService.register(dto.email, dto.password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = await validateDto(LoginDto, req.body);
    const tokens = await AuthService.login(dto.email, dto.password);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refresh: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = (req.body as { refreshToken?: string }) ?? {};
    if (!refreshToken) {
      // direct JSON response, no return value from handler
      res.status(400).json({ error: 'Missing refreshToken' });
      return;
    }
    const tokens = await AuthService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};
