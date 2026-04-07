import fs from 'fs'
import { Client } from 'pg'

function loadEnv() {
  const envFile = 'c:\\Users\\dfuser\\Desktop\\gcbs\\.env'
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
  if (!databaseUrl) throw new Error('DATABASE_URL is not set')

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  const tables = await client.query(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('about_pages', 'admission_pages')
  `)

  const types = await client.query(`
    SELECT typname, nspname
    FROM pg_catalog.pg_type t
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE typname IN ('about_pages', 'admission_pages')
  `)

  console.log('tables:', tables.rows)
  console.log('types:', types.rows)

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
