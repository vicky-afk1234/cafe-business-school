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

  console.log('Checking for missing tables...')

  const existingTables = await client.query(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('about_pages', 'admission_pages')
  `)

  const existing = new Set(existingTables.rows.map((row) => row.tablename))

  if (!existing.has('about_pages')) {
    console.log('Creating about_pages...')
    await client.query(`
      CREATE TABLE public.about_pages (
        id TEXT PRIMARY KEY,
        mission_badge TEXT,
        mission_title TEXT,
        mission_accent TEXT,
        mission_body TEXT,
        mission_image_url TEXT,
        mission_image_alt TEXT,
        highlights JSONB,
        values JSONB,
        cta_heading TEXT,
        cta_subheading TEXT,
        cta_label TEXT,
        cta_url TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `)
  } else {
    console.log('Dropping and recreating about_pages with correct schema...')
    await client.query(`DROP TABLE public.about_pages`)
    await client.query(`
      CREATE TABLE public.about_pages (
        id TEXT PRIMARY KEY,
        mission_badge TEXT,
        mission_title TEXT,
        mission_accent TEXT,
        mission_body TEXT,
        mission_image_url TEXT,
        mission_image_alt TEXT,
        highlights JSONB,
        values JSONB,
        cta_heading TEXT,
        cta_subheading TEXT,
        cta_label TEXT,
        cta_url TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `)
  }

  if (!existing.has('admission_pages')) {
    console.log('Creating admission_pages...')
    await client.query(`
      CREATE TABLE public.admission_pages (
        id TEXT PRIMARY KEY,
        req_title TEXT,
        req_subtitle TEXT,
        requirements JSONB,
        process_title TEXT,
        process_steps JSONB,
        faq_title TEXT,
        faqs JSONB,
        documents JSONB,
        contact_email TEXT,
        contact_phone TEXT,
        contact_heading TEXT,
        contact_body TEXT,
        cta_label TEXT,
        cta_url TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `)
  } else {
    console.log('Dropping and recreating admission_pages with correct schema...')
    await client.query(`DROP TABLE public.admission_pages`)
    await client.query(`
      CREATE TABLE public.admission_pages (
        id TEXT PRIMARY KEY,
        req_title TEXT,
        req_subtitle TEXT,
        requirements JSONB,
        process_title TEXT,
        process_steps JSONB,
        faq_title TEXT,
        faqs JSONB,
        documents JSONB,
        contact_email TEXT,
        contact_phone TEXT,
        contact_heading TEXT,
        contact_body TEXT,
        cta_label TEXT,
        cta_url TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `)
  }

  await client.end()
  console.log('Tables checked/created successfully.')
}

main().catch((error) => {
  console.error('Error creating tables:', error)
  process.exit(1)
})
