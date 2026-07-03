const { Client } = require('pg');
const fs = require('fs');

const sql = fs.readFileSync('backup-db/setup_full.sql', 'utf8');

const client = new Client({
  host: '2a05:d018:cb1:bb00:dc2a:ed26:9c5d:e55f',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '585MmOAHkEXTpxJm',
  ssl: { rejectUnauthorized: false }
});

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
