import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostContent = async () => {
    setLoading(true);
    try {
      const contents_id = await postContents({
        title,
        url,
        category_id: categoryId,
      });
      onOpenChange(false);
      router.push(`/contents/${contents_id}`);
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-4"
          placeholder="YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="w-full bg-black text-white py-2"
          disabled={loading}
          onClick={handlePostContent}
        >
          {loading ? "업로드 중..." : "등록"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
