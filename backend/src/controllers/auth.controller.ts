// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { User } from "../types/user.types";

export const login = (req: Request, res: Response) => {
  const user = req.user as User;
  const authResponse = authService.generateAuthResponse(user);
  res.json(authResponse);
};
