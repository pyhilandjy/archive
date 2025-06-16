"use client";

import Image from "next/image";
import { ContentsList } from "@/lib/contents-list-api";
import { Card as UICard } from "@/components/ui/card";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteContent } from "@/lib/contents-list-api";
import { useRouter } from "next/navigation";

interface CardProps {
  item: ContentsList;
}

export function Card({ item }: CardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteContent(item.id);
    // 필요 시 삭제 후 추가 작업 수행 (예: 상태 업데이트)
  };

  const handleClick = () => {
    router.push(`/contents/${item.id}`);
  };

  return (
    <UICard className="overflow-hidden cursor-pointer" onClick={handleClick}>
      <div className="relative aspect-video">
        <Image
          src={item.thumbnail_path}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate">{item.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg">
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </UICard>
  );
}
