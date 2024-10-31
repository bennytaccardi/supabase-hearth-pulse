export interface SupabaseConfig {
  [key: string]: {
    dbUrl: string;
    dbAnonKey: string;
  };
}
