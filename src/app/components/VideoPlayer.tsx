'use client'

interface VideoPlayerProps {
  src: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export default function VideoPlayer({ 
  src, 
  className = '', 
  autoplay = false,
  muted = false,
  loop = false 
}: VideoPlayerProps) {
  // Extract YouTube video ID - handles multiple URL formats
  const getYouTubeId = (url: string): string | null => {
    // Handle various YouTube URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://youtube.com/v/VIDEO_ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string): string | null => {
    // Handle various Vimeo URL formats:
    // - https://vimeo.com/VIDEO_ID
    // - https://vimeo.com/channels/CHANNEL/VIDEO_ID
    // - https://player.vimeo.com/video/VIDEO_ID
    const patterns = [
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?:channels\/[^\/]+\/)?(\d+)/,
      /^(\d+)$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Check if it's a YouTube URL
  if (src.includes('youtube.com') || src.includes('youtu.be') || /^[a-zA-Z0-9_-]{11}$/.test(src)) {
    const videoId = getYouTubeId(src);
    if (videoId) {
      const embedParams = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        ...(autoplay && { autoplay: '1' }),
        ...(muted && { mute: '1' }),
        ...(loop && { loop: '1', playlist: videoId })
      });
      
      return (
        <div className={`w-full h-full select-none ${className}`} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`}
            className="w-full h-full pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="Video player"
            loading="lazy"
            draggable={false}
          />
        </div>
      );
    }
  }

  // Check if it's a Vimeo URL
  if (src.includes('vimeo.com') || /^\d+$/.test(src)) {
    const videoId = getVimeoId(src);
    if (videoId) {
      const embedParams = new URLSearchParams({
        title: '0',
        byline: '0',
        portrait: '0',
        ...(autoplay && { autoplay: '1' }),
        ...(muted && { muted: '1' }),
        ...(loop && { loop: '1' })
      });
      
      return (
        <div className={`w-full h-full select-none ${className}`} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?${embedParams.toString()}`}
            className="w-full h-full pointer-events-auto"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video player"
            loading="lazy"
            draggable={false}
          />
        </div>
      );
    }
  }

  // Local video file or external MP4/WebM/etc
  return (
    <div 
      className={`w-full h-full select-none ${className}`} 
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
      onDragStart={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
    >
      <video
        src={src}
        controls
        className="w-full h-full object-cover pointer-events-auto"
        playsInline
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        preload="metadata"
        poster=""
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => {
          // Allow right-click for video controls but prevent text selection
          e.stopPropagation();
        }}
      >
        <source src={src} type={`video/${src.split('.').pop()?.toLowerCase() || 'mp4'}`} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
