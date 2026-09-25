export function isVideoMedia(mediaUrl: string): boolean {
  if (mediaUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i)) {
    return true
  }
  if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
    return true
  }
  if (mediaUrl.includes('vimeo.com')) {
    return true
  }
  return false
}

export function getVideoType(mediaUrl: string): 'youtube' | 'vimeo' | 'local' | null {
  if (!isVideoMedia(mediaUrl)) return null
  if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
    return 'youtube'
  }
  if (mediaUrl.includes('vimeo.com')) {
    return 'vimeo'
  }
  return 'local'
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
