import {{ readFileSync }} from 'fs'
import {{ join }} from 'path'
import {{ NextResponse }} from 'next/server'

export async function GET() {{
  const html = readFileSync(join(process.cwd(), 'public/royal-logs/index.html'))
  return new NextResponse(html, {{
    headers: {{ 'content-type': 'text/html; charset=utf-8' }}
  }})
}}
