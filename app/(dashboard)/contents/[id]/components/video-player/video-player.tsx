import { useRef, useEffect, useState } from "react";

export interface VideoPlayerProps {
  videoPath: string | null;
  thumbnailPath: string | null;
  title: string;
}

export function VideoPlayer({ videoPath, thumbnailPath }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoPath) return;

    const savedTime = localStorage.getItem(`videoTime_${videoPath}`);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!video) return;

      // INPUT, TEXTAREA 등에선 무시
      if (
        event.target &&
        ["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
          break;
        case "ArrowLeft":
          event.preventDefault();
          video.currentTime = Math.max(video.currentTime - 5, 0);
          break;
        case " ":
        case "k":
          event.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          video.volume = Math.min(video.volume + 0.1, 1);
          break;
        case "ArrowDown":
          event.preventDefault();
          video.volume = Math.max(video.volume - 0.1, 0);
          break;
        case "m":
          event.preventDefault();
          video.muted = !video.muted;
          break;
        case "f":
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            video.requestFullscreen();
          }
          break;
        case "j":
          event.preventDefault();
          video.currentTime = Math.max(video.currentTime - 10, 0);
          break;
        case "l":
          event.preventDefault();
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
          break;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoPath]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      localStorage.setItem(
        `videoTime_${videoPath}`,
        video.currentTime.toString()
      );
    };
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleVolumeChange = () => setVolume(video.volume);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoPath]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!videoPath) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        비디오를 로드 중입니다...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-[60%] h-[60vh] bg-black mt-30 group focus:outline-none"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnailPath || "/public/no-thumbnail.png"}
        onClick={togglePlay}
        onDoubleClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoRef.current?.requestFullscreen();
          }
        }}
      >
        <source src={videoPath} type="video/mp4" />
        <source src={videoPath} type="video/webm" />
        <source src={videoPath} type="video/ogg" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div
          className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-red-500 rounded-full relative"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 text-2xl"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            <button
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  videoRef.current?.requestFullscreen();
                }
              }}
              className="text-white hover:text-gray-300 text-xl"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div>스페이스/K: 재생/일시정지</div>
        <div>←/→: 5초 이동</div>
        <div>J/L: 10초 이동</div>
        <div>↑/↓: 볼륨 조절</div>
        <div>M: 음소거</div>
        <div>F: 전체화면</div>
      </div>
    </div>
  );
}
