import db from "../config/database";
import { User } from "../types/user.types";

export const findUserByEmail = (email: string): User | undefined => {
  return db.get("users").find({ email }).value();
};

export const findUserById = (id: string): User | undefined => {
  return db.get("users").find({ _id: id }).value();
};

export const updateUser = (
  id: string,
  updates: Partial<User>
): User | undefined => {
  return db.get("users").find({ _id: id }).assign(updates).write();
};

export const getUserBalance = (id: string): string | undefined => {
  const user = findUserById(id);
  return user?.balance;
};
