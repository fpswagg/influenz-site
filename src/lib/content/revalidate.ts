import { revalidateTag } from 'next/cache'
import { SITE_CACHE_TAG } from '@/lib/content/queries'

export function revalidateSite() {
  revalidateTag(SITE_CACHE_TAG)
}
