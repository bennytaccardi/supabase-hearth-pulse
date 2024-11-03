import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseConfig } from "./types/types";
import * as serviceModule from "./service";

/**
 * Keeps the connection alive by performing a delete and insert operation.
 * @param client - The Supabase client instance.
 */
export const keepAlive = async (client: SupabaseClient): Promise<void> => {
  try {
    await client.from("keep-alive").delete().neq("id", 0);
    await client.from("keep-alive").insert({ name: "test" });
  } catch (error) {
    console.error("Error in keep-alive operation:", error);
    throw error;
  }
};

/**
 * Main function to iterate over each config and perform keep-alive operations.
 */
export const handler = async (localConfigs: SupabaseConfig) => {
  try {
    for (const db in localConfigs) {
      const config = localConfigs[db];

      if (!config.dbUrl || !config.dbAnonKey) {
        console.warn(`Skipping ${db} due to missing configuration.`);
        continue;
      }

      console.log(`Keeping alive ${db}...`);
      const client = createClient(config.dbUrl, config.dbAnonKey);

      await serviceModule.keepAlive(client);
    }

    console.log("All keep-alive operations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("An error occurred during the keep-alive process:", error);
    process.exit(1);
  }
};
