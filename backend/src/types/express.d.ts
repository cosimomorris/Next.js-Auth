import { User } from "./user.types";

declare global {
  namespace Express {
    interface User extends User {}
  }
}
