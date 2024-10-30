import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(
  "https://vlxxkfybifhklskgwsyi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZseHhrZnliaWZoa2xza2d3c3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MTY4MDksImV4cCI6MjA0MzM5MjgwOX0.jRdiwXaqK63p-DiVlgwB_n4PBZBkFwA-WaRAGT5WOhw"
);

const test = async () => {
  try {
    const res = await supabase.from("keep-alive").insert({ name: "test" });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
  console.log("eccomi");
};
test();
