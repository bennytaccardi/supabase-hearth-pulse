import dbConfigs from "../config.json";
import { SupabaseConfig } from "./types/types";
import { handler } from "./service";

const configs = dbConfigs as SupabaseConfig;

handler(configs);
