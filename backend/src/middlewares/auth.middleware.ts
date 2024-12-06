// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByEmail } from "../utils/db.utils";
import { comparePasswords } from "../utils/password.utils";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Local Strategy for email/password login
const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = findUserByEmail(email);

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      // For now, direct password comparison
      const isValidPassword = password === user.password;

      if (!isValidPassword) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

// JWT Strategy
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await findUserById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

export const configurePassport = () => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
  return passport.initialize();
};

export const authenticateJwt = passport.authenticate("jwt", { session: false });
export const authenticateLocal = passport.authenticate("local", {
  session: false,
});

export const handleAuthError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" });
  }
  next(err);
};
