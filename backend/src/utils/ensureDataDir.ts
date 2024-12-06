import { mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const ensureDataDirectory = async () => {
  const dataPath = join(__dirname, "../../data");

  if (!existsSync(dataPath)) {
    try {
      await mkdir(dataPath, { recursive: true });
      console.log("Data directory created successfully");
    } catch (error) {
      console.error("Error creating data directory:", error);
      throw error;
    }
  }
};
