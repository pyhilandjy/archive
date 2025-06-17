import ReactPlayer from "react-player";

export interface VideoPlayerProps {
  videoPath: string | null;
  thumbnailPath: string | null;
  title: string;
}

export function VideoPlayer({ videoPath, thumbnailPath }: VideoPlayerProps) {
  if (!videoPath) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        비디오를 로드 중입니다...
      </div>
    );
  }

  return (
    <div className="relative w-[60%] h-[60vh] bg-black">
      <ReactPlayer
        url={videoPath}
        controls
        width="100%"
        height="100%"
        playing={false}
        light={thumbnailPath || undefined}
        onPlay={() => console.log("Video is playing")}
        onPause={() => console.log("Video is paused")}
        onError={(e) => console.error("Video error:", e)}
      />
    </div>
  );
}
