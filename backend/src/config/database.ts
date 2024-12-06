import { join } from "path";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Database } from "../types/user.types";

// Define the database path relative to the project root
const dbPath = join(__dirname, "../../../data/users.json");

// Create the adapter and database instance
const adapter = new FileSync<Database>(dbPath);
const db = low(adapter);

// Initialize the database with default data if empty
db.defaults({ users: [] }).write();

export default db;
