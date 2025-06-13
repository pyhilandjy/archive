"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default function CreatePostPage({ params }: PageProps) {
  const router = useRouter();
  const categoryId = params.id;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !url) return alert("제목과 URL을 모두 입력하세요");
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, url, category_id: categoryId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("업로드 실패");

      const { post_id } = await res.json();
      router.push(`/main/contents/${post_id}`);
    } catch (error) {
      console.error("게시물 업로드 실패:", error);
      alert("게시물 업로드 중 문제가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">YouTube 게시물 등록</h1>
      <input
        className="border p-2 w-full mb-3"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        placeholder="YouTube URL을 붙여넣으세요"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "업로드 중..." : "게시물 등록"}
      </button>
    </div>
  );
}
