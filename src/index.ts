import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dbConfigs from "../config.json";
import { SupabaseConfig } from "./types/types";

const configs = dbConfigs as SupabaseConfig;

const keepAlive = async (client: SupabaseClient) => {
  await client.from("keep-alive").delete().neq("id", 0);
  await client.from("keep-alive").insert({ name: "test" });
};

const main = async () => {
  for (const db in configs) {
    const config = configs[db];
    const client = createClient(config.dbUrl, config.dbAnonKey);
    await keepAlive(client);
  }
  process.exit(0);
};

main();
