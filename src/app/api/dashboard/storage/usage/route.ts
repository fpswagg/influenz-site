import { NextResponse } from 'next/server'
import { requireDashboardAuth } from '@/lib/auth/guard'
import { getMediaUsage } from '@/lib/storage/media-usage'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireDashboardAuth()
    return NextResponse.json({ usage: await getMediaUsage() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Usage lookup failed'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
