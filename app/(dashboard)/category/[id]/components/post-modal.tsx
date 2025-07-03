import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { postContents } from "@/lib/contents-api";

export function PostModal({
  open,
  onOpenChange,
  categoryId,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  categoryId: string;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isList, setIsList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (isList && title) setTitle("");
    if (isList) setTitleError(false);
  }, [isList, title]);

  const handlePostContent = async () => {
    if (!isList && !title) {
      setTitleError(true);
      return;
    }
    setLoading(true);
    try {
      await postContents({
        title: isList ? undefined : title,
        url,
        category_id: categoryId,
        is_list: isList,
      });
      await queryClient.invalidateQueries({
        queryKey: ["contents", categoryId],
      });

      onOpenChange(false);
      setTitle("");
      setUrl("");
      setIsList(false);
      setTitleError(false);
    } catch {
      alert("업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-lg font-bold mb-4">
          새 포스트 생성
        </DialogTitle>
        <input
          className="w-full border p-2 mb-2"
          placeholder="제목"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(false);
          }}
          disabled={isList}
          required={!isList}
        />
        {titleError && (
          <div className="text-red-500 text-xs mb-2">제목을 입력해주세요.</div>
        )}
        <input
          className="w-full border p-2 mb-4"
          placeholder="YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isList}
            onChange={(e) => setIsList(e.target.checked)}
            className="mr-2"
          />
          리스트로 등록
        </label>
        <button
          className="w-full bg-black text-white py-2"
          // disabled={isSubmitDisabled}
          onClick={handlePostContent}
        >
          {loading ? "업로드 중..." : "등록"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
