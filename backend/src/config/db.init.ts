import db from "./database";

export const initializeDatabase = () => {
  const existingUsers = db.get("users").value();

  if (!existingUsers || existingUsers.length === 0) {
    console.log("Warning: No users found in database");
  } else {
    console.log(`Database loaded with ${existingUsers.length} users`);
  }
};
