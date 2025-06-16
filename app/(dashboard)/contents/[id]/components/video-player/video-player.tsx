import ReactPlayer from "react-player";

export interface VideoPlayerProps {
  videoPath: string | null;
  thumbnailPath: string | null;
  title: string;
}

export function VideoPlayer({
  videoPath,
  thumbnailPath,
  title,
}: VideoPlayerProps) {
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
        light={thumbnailPath || undefined} // 썸네일 이미지
        onPlay={() => console.log("Video is playing")}
        onPause={() => console.log("Video is paused")}
        onError={(e) => console.error("Video error:", e)}
      />
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
        <h2 className="text-lg font-semibold truncate max-w-md">{title}</h2>
      </div>
    </div>
  );
}
