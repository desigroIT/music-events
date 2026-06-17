"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface CustomVideoPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  lessonTitle?: string;
  isFreePreview?: boolean;
  userEmail?: string;
  userName?: string;
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function CustomVideoPlayer({
  videoUrl,
  posterUrl,
  lessonTitle = "Introduction to Drums",
  isFreePreview = false,
  userEmail,
  userName,
}: CustomVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;

  // Load YouTube IFrame API
  useEffect(() => {
    if (!videoId) return;

    // Load YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
          videoId: videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              setDuration(event.target.getDuration());
              setVolume(event.target.getVolume());
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTracking();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopProgressTracking();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopProgressTracking();
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracking();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Progress tracking
  const startProgressTracking = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Play/Pause toggle
  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Mute/Unmute toggle
  const toggleMute = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;

    const newVolume = parseInt(e.target.value);
    playerRef.current.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Seek video
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;

    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playerRef.current.seekTo(pos * duration, true);
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current.seekTo(newTime, true);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  // Format time (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative bg-black rounded-2xl overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* YouTube Player */}
        <div className="w-full aspect-video">
          <div
            id={`youtube-player-${videoId}`}
            className="w-full h-full"
          />
        </div>

        {/* Click overlay for play/pause */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={togglePlay}
          style={{ zIndex: 1 }}
        />

        {/* Animated Moving Watermark Overlay */}
        {(userEmail || userName) && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
            {/* Moving watermark 1 - Top to Bottom */}
            <div
              className="absolute text-white/40 text-xs font-space bg-black/30 px-3 py-1 rounded backdrop-blur-sm animate-float-vertical"
              style={{
                animation: 'floatVertical 15s ease-in-out infinite',
                left: '10%',
              }}
            >
              {userName || userEmail}
            </div>

            {/* Moving watermark 2 - Left to Right */}
            <div
              className="absolute text-white/30 text-xs font-space bg-black/20 px-3 py-1 rounded backdrop-blur-sm"
              style={{
                animation: 'floatHorizontal 20s ease-in-out infinite',
                top: '15%',
              }}
            >
              {userEmail}
            </div>

            {/* Moving watermark 3 - Diagonal bounce */}
            <div
              className="absolute text-white/35 text-sm font-space bg-black/25 px-3 py-1 rounded backdrop-blur-sm"
              style={{
                animation: 'floatDiagonal 18s ease-in-out infinite',
              }}
            >
              {userName || userEmail}
            </div>

            {/* Center rotating watermark (semi-transparent, large) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-2xl md:text-4xl font-orbitron font-bold pointer-events-none select-none"
              style={{
                animation: 'rotateWatermark 30s linear infinite',
              }}
            >
              {userName || userEmail}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes floatVertical {
            0%, 100% { top: 5%; }
            50% { top: 75%; }
          }

          @keyframes floatHorizontal {
            0%, 100% { left: 5%; }
            50% { left: 85%; }
          }

          @keyframes floatDiagonal {
            0% { top: 10%; left: 10%; }
            25% { top: 70%; left: 80%; }
            50% { top: 15%; left: 75%; }
            75% { top: 65%; left: 15%; }
            100% { top: 10%; left: 10%; }
          }

          @keyframes rotateWatermark {
            0% { transform: translate(-50%, -50%) rotate(-30deg); }
            50% { transform: translate(-50%, -50%) rotate(30deg); }
            100% { transform: translate(-50%, -50%) rotate(-30deg); }
          }
        `}</style>

        {/* Play Button Overlay (Center) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C00] flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-[#FF4500]/50"
            >
              <Play fill="white" className="text-white w-8 h-8 ml-1" />
            </button>
          </div>
        )}

        {/* Custom Controls (Bottom) */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300 ${
            isHovering || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 2 }}
        >
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-4 group/progress hover:h-2 transition-all"
          >
            <div
              className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF8C00] rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FF4500] rounded-full shadow-lg shadow-[#FF4500]/50 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Play/Pause + Skip + Time */}
            <div className="flex items-center gap-3">
              {/* Skip Back */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-[#FF4500] transition-colors"
              >
                <SkipBack size={20} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C00] flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause fill="white" className="text-white w-4 h-4" />
                ) : (
                  <Play fill="white" className="text-white w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-[#FF4500] transition-colors"
              >
                <SkipForward size={20} />
              </button>

              {/* Time Display */}
              <span className="text-sm text-white font-space font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right: Volume + Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Volume Control */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#FF4500] transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/20 rounded-full cursor-pointer accent-[#FF4500]"
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#FF4500] transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Title Bar */}
      <div className="flex items-center justify-between mt-6 p-4 glass-card border border-white/10 rounded-xl">
        <h3 className="font-orbitron font-bold text-xl text-white">{lessonTitle}</h3>
        {isFreePreview && (
          <span className="px-4 py-1.5 bg-[#00FF85]/20 text-[#00FF85] text-xs font-space rounded-lg border border-[#00FF85]/30 uppercase font-bold">
            Free Preview
          </span>
        )}
      </div>
    </div>
  );
}
