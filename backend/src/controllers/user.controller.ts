import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { User } from "../types/user.types";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const profile = await userService.getUserProfile(user._id);

    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const balance = await userService.getUserBalance(user._id);

    if (!balance) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ balance });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    const allowedUpdates = ["name", "phone", "address"];

    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedUser = await userService.updateUserProfile(user._id, updates);

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
