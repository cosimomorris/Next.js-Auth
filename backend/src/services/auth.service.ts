// src/services/auth.service.ts
import { User } from "../types/user.types";
import { generateToken } from "../utils/jwt.utils";
import { findUserByEmail } from "../utils/db.utils";

export class AuthService {
  public async validateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = findUserByEmail(email);

    if (!user) {
      return null;
    }

    // For now, direct comparison. In production, use proper password hashing
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  public generateAuthResponse(user: User) {
    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

export const authService = new AuthService();
