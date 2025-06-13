"use client";

import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

export function PostButton() {
  //   const router = useRouter();

  const handlePost = () => {
    console.log("포스트 버튼 클릭");
    // TODO: 포스트 생성 페이지로 이동 또는 모달 열기
    // 예: router.push('/post/create');
  };

  return (
    <Button onClick={handlePost} className="bg-blue-500 hover:bg-blue-600">
      포스트 추가
    </Button>
  );
}
