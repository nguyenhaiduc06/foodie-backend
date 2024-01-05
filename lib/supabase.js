import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://jdcwtlsthduxdrgryucg.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkY3d0bHN0aGR1eGRyZ3J5dWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExODIwNTQsImV4cCI6MjAxNjc1ODA1NH0.Hs3rr8cXnGlDblUjl4dXFAw50W1yqks5dTPl0O2BjYA";

const supabaseUrl = "https://vfacmpirjrvdgusdxgfo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmYWNtcGlyanJ2ZGd1c2R4Z2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2NzQwMjQsImV4cCI6MjAxNDI1MDAyNH0.Z_3NyaWtoh3f4ZEkllSibxJp9NnF22NKud2uoM66Gjo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
