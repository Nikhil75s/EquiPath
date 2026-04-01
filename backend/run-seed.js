require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function runSQL(filePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
  console.log(`Running ${filePath}...`);
  await db.query(sql);
  console.log(`Completed ${filePath}`);
}

async function main() {
  try {
    await runSQL('../database/schema.sql');
    await runSQL('../database/seed.sql');
    console.log('Database provisioned successfully.');
  } catch (err) {
    console.error('Error provisioning database:', err);
  } finally {
    process.exit(0);
  }
}

main();
