"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useDebounce } from "use-debounce";
import { getContentsById, updateContentsDescription } from "@/lib/contents-api";
import { FloatingActionButton } from "./components/floating-action-button";
import { Header } from "./components/header";
import { VideoPlayer } from "./components/video-player/video-player";
import { EditorContainer } from "./components/editor/editor-container";
import "./styles/editor.css";
import "./styles/video-player.css";

interface ContentsPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: ContentsPageProps) {
  const { id } = use(params);

  const [title, setTitle] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [debouncedDescription] = useDebounce(description, 1000);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDescriptionOnRight, setIsDescriptionOnRight] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getContentsById(id)
        .then((data) => {
          if (data) {
            setTitle(data.title || "제목 없음");
            setVideoPath(data.video_path || null);
            setThumbnailPath(data.thumbnail_path || null);
            setDescription(data.description || "");
          } else {
            console.error("No data returned from getContentsById");
          }
        })
        .catch((error) => console.error("Failed to fetch content:", error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (debouncedDescription && id) {
      setIsSaving(true);
      updateContentsDescription(id, debouncedDescription)
        .then(() => setLastSaved(new Date()))
        .catch((error) => console.error("Failed to save description:", error))
        .finally(() => setIsSaving(false));
    }
  }, [debouncedDescription, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 ${
        isDescriptionOnRight ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      <Header
        title={title || "제목 없음"}
        id={id}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isDescriptionOnRight={isDescriptionOnRight}
        setIsDescriptionOnRight={setIsDescriptionOnRight}
      />
      <div className="flex flex-1">
        <div
          className={`w-full h-full ${
            isDescriptionOnRight ? "flex flex-row" : "flex flex-col"
          }`}
        >
          <VideoPlayer
            videoPath={videoPath}
            thumbnailPath={thumbnailPath}
            title={title || "제목 없음"}
          />
          <EditorContainer
            description={description}
            setDescription={setDescription}
            isDescriptionOnRight={isDescriptionOnRight}
            setIsDescriptionOnRight={setIsDescriptionOnRight}
          />
        </div>
      </div>
      <FloatingActionButton
        isDescriptionOnRight={isDescriptionOnRight}
        setIsDescriptionOnRight={setIsDescriptionOnRight}
      />
    </div>
  );
}
