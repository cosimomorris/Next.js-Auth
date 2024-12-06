// src/routes/user.routes.ts
import { Router } from "express";
import {
  getProfile,
  getBalance,
  updateProfile,
} from "../controllers/user.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authenticateJwt, getProfile);
router.get("/balance", authenticateJwt, getBalance);
router.put("/profile", authenticateJwt, updateProfile);

export default router;
