// Configuración del POS web de la vendedora.
// -------------------------------------------------------------
// SUPABASE_URL ya viene puesto (es el mismo proyecto del escritorio).
//
// SUPABASE_ANON_KEY: PEGA AQUÍ la clave PÚBLICA (anon / publishable) de tu proyecto Supabase.
//   Dónde sacarla:  Supabase  ->  Project Settings  ->  API Keys  ->  "anon public"
//   (empieza con "eyJ..." o "sb_publishable_...").
//
// ⚠️ IMPORTANTE: NO pongas aquí la clave secreta (sb_secret_... / service_role). Esa es la del
//    escritorio y NUNCA debe ir en una página web. La anon key es pública a propósito: la
//    seguridad la dan las funciones pos_* + RLS en la base de datos.
window.POS_CONFIG = {
  SUPABASE_URL: "https://flfhpffslhjcuvhxsnjz.supabase.co",
  // Clave pública (anon) de tu proyecto — la misma que ya usa la app de escritorio.
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZmhwZmZzbGhqY3V2aHhzbmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzg0MDMsImV4cCI6MjA4NDQxNDQwM30.9AxJDLzH2f5jJxAarw5dc1DMuvDlFY2sAr6zJBNUsFc",
  MONEDA: "$",        // símbolo de moneda para mostrar precios
};
