// src/services/user.service.ts
import { User } from "../types/user.types";
import db from "../config/database";

export class UserService {
  public async getUserProfile(
    userId: string
  ): Promise<Omit<User, "password"> | null> {
    const user = db.get("users").find({ _id: userId }).value();

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async getUserBalance(userId: string): Promise<string | null> {
    const user = db.get("users").find({ _id: userId }).value();

    return user ? user.balance : null;
  }

  public async updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, "name" | "phone" | "address">>
  ): Promise<Omit<User, "password"> | null> {
    const user = db.get("users").find({ _id: userId }).assign(updates).write();

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userService = new UserService();
