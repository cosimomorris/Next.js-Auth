// src/routes/auth.routes.ts
import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authenticateLocal } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", authenticateLocal, login);

export default router;
