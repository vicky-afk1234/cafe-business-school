import fs from 'fs'
import { Client } from 'pg'

function loadEnv() {
  const envFile = 'c:\\Users\\dfuser\\Desktop\\gcbs\\.env'
  if (!fs.existsSync(envFile)) {
    throw new Error('.env file not found')
  }

  const content = fs.readFileSync(envFile, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (!match) continue
    const key = match[1].trim()
    let value = match[2].trim()
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

async function main() {
  loadEnv()

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in .env')
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  console.log('Checking about_pages table structure...')

  const res = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'about_pages' AND table_schema = 'public'
    ORDER BY ordinal_position;
  `)

  console.log('Current about_pages columns:')
  res.rows.forEach(row => {
    console.log(`${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${row.column_default ? 'DEFAULT ' + row.column_default : ''}`)
  })

  await client.end()
}

main().catch(console.error)