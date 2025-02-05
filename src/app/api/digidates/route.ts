import { NextResponse } from 'next/server'

const DIGIDATES_API_KEY = process.env.DIGIDATES_API_KEY
const DIGIDATES_BASE_URL = 'https://api.digidates.com/v1' // Replace with actual base URL

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, format } = body

    const response = await fetch(`${DIGIDATES_BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIGIDATES_API_KEY}`
      },
      body: JSON.stringify({
        date,
        format
      })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Digidates API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process date' },
      { status: 500 }
    )
  }
} 