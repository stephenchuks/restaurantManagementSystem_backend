// src/modules/auth/auth.controller.ts
import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const dto = plainToInstance(RegisterDto, req.body);
    await validateOrReject(dto);
    const user = await AuthService.register(dto.email, dto.password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const dto = plainToInstance(LoginDto, req.body);
    await validateOrReject(dto);
    const tokens = await AuthService.login(dto.email, dto.password);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};
