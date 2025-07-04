import { useState } from "react";
import Image from "next/image";
import { ContentsList } from "@/lib/contents-list-api";
import { Card as UICard } from "@/components/ui/card";
import { MoreVertical, Trash2, Loader2, AlertTriangle } from "lucide-react";
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
  onDelete?: (id: string) => void;
}

export function Card({ item, onDelete }: CardProps) {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteContent(item.id);
      setIsDeleted(true);
      if (onDelete) {
        onDelete(item.id);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleClick = () => {
    if (item.status === "DONE") {
      router.push(`/contents/${item.id}`);
    }
  };

  const renderThumbnail = () => {
    if (item.status === "ON_PROCESS") {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      );
    } else if (item.status === "NOT_STARTED") {
      return (
        <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
          대기 중...
        </div>
      );
    } else if (item.status === "FAILED") {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
      );
    } else {
      return (
        <Image
          src={item.thumbnail_path}
          alt={item.title}
          fill
          className="object-cover"
        />
      );
    }
  };

  if (isDeleted) return null;

  return (
    <UICard
      className={`overflow-hidden ${
        item.status === "DONE" ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="relative aspect-video">{renderThumbnail()}</div>
      <div className="p-4 flex items-center justify-between">
        <div className="min-w-0">
          {" "}
          <h3 className="text-lg font-semibold truncate">{item.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg">
            <DropdownMenuItem onClick={(e) => handleDelete(e)}>
              <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </UICard>
  );
}
