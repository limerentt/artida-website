import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      )
    }

    // Save submission to JSON file
    const submission = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      email,
      phone: phone || null,
      message,
      createdAt: new Date().toISOString(),
    }

    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'submissions.json')

    // Ensure data directory exists
    await mkdir(dataDir, { recursive: true })

    // Read existing submissions
    let submissions: typeof submission[] = []
    try {
      const { readFile } = await import('fs/promises')
      const existing = await readFile(filePath, 'utf-8')
      submissions = JSON.parse(existing)
    } catch {
      // File doesn't exist yet — start fresh
    }

    submissions.push(submission)
    await writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8')

    // Log to console for convenience
    console.log('📩 New contact submission:', {
      name,
      email,
      phone,
      message: message.slice(0, 100),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
