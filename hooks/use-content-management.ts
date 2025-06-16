import { useState, useEffect } from "react";
import { use } from "react";
import { useDebounce } from "use-debounce";
import { getContentsById, updateContentsDescription } from "@/lib/contents-api";

export function useContentManagement(params: Promise<{ id: string }>) {
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
            console.log("Data loaded:", data);
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

  return {
    id,
    title,
    videoPath,
    thumbnailPath,
    description,
    setDescription,
    isSaving,
    lastSaved,
    isDescriptionOnRight,
    setIsDescriptionOnRight,
    isLoading,
  };
}
