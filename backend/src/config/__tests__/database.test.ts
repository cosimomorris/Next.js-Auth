import db from "../database";
import { User } from "../../types/user.types";

describe("Database Configuration", () => {
  // Store original data before tests
  let originalData: User[];

  beforeAll(() => {
    // Save the original data
    originalData = db.get("users").value();
  });

  afterAll(() => {
    // Restore the original data after all tests
    db.set("users", originalData).write();
  });

  it("should have users in database", () => {
    const users = db.get("users").value();
    expect(users.length).toBeGreaterThan(0);
  });

  it("should find specific user by email", () => {
    const user = db
      .get("users")
      .find({ email: "henderson.briggs@geeknet.net" })
      .value();

    expect(user).toBeDefined();
    expect(user?.name.first).toBe("Henderson");
  });
});
