// Pokretanje SQL skripte nad bazom.
// Konekcija se čita iz env varijable, NIKAD hardkodovano:
//   DATABASE_URL='postgresql://user:pass@host:5432/postgres' node _run_sql.js backup-db/setup_full.sql
const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: postavi DATABASE_URL env varijablu.');
  process.exit(1);
}

const file = process.argv[2];
if (!file) {
  console.error('ERROR: navedi SQL fajl, npr. node _run_sql.js backup-db/setup_full.sql');
  process.exit(1);
}

const sql = fs.readFileSync(file, 'utf8');
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

(async () => {
  try {
    await client.connect();
    console.log('CONNECTED to PostgreSQL');
    const res = await client.query(sql);
    console.log('SQL executed successfully');
    if (Array.isArray(res)) {
      console.log('Commands:', res.length);
    } else {
      console.log('RowCount:', res.rowCount);
    }
    await client.end();
    console.log('DONE');
  } catch (err) {
    console.error('ERROR:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
    try { await client.end(); } catch(e) {}
    process.exit(1);
  }
})();
