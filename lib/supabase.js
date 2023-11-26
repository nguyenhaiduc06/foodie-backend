// const password = "BDTJAH931yLttCAb"
// const macOS_Token = "sbp_c4993ecbe0d8043e2f4ae81f56680f6f7732bc20"

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vfacmpirjrvdgusdxgfo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmYWNtcGlyanJ2ZGd1c2R4Z2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2NzQwMjQsImV4cCI6MjAxNDI1MDAyNH0.Z_3NyaWtoh3f4ZEkllSibxJp9NnF22NKud2uoM66Gjo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
