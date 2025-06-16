"use client";

import { Button } from "@/components/ui/button";

export function PostButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="bg-blue-500 hover:bg-blue-600">
      포스트 추가
    </Button>
  );
}
