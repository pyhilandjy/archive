import Image from "next/image";
import { ContentsList } from "@/lib/contents-list-api";
import { Card as UICard } from "@/components/ui/card";

interface CardProps {
  item: ContentsList;
}

export function Card({ item }: CardProps) {
  return (
    <UICard className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={item.thumbnail_path}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{item.title}</h3>
      </div>
    </UICard>
  );
}
