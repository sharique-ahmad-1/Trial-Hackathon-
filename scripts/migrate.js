// scripts/migrate.js
// Migration runner to execute SQL directly on Supabase Project
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'kcodussczqgiagwtlrxw';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function runMigration() {
  if (!SUPABASE_ACCESS_TOKEN) {
    console.log('[Migrate] SUPABASE_ACCESS_TOKEN not set in environment. Skipping direct management query.');
    console.log('[Migrate] Schema is also available in /supabase/migrations/001_initial_schema.sql');
    return;
  }

  const sqlPath = path.resolve(__dirname, '../supabase/migrations/001_initial_schema.sql');
  console.log(`[Migrate] Reading SQL from ${sqlPath}...`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log(`[Migrate] Executing migration on Supabase project ${SUPABASE_PROJECT_REF}...`);
  const response = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sqlContent })
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`[Migrate] Failed with status ${response.status}:`, text);
    process.exit(1);
  }

  console.log(`[Migrate] Migration executed successfully! Result:`, text);
}

runMigration().catch((err) => {
  console.error('[Migrate] Error executing migration:', err);
  process.exit(1);
});
