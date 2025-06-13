import { ContentsList } from "@/lib/contents-list-api";
import { Card } from "./list-card";

interface GridProps {
  items: ContentsList[];
}

export function Grid({ items }: GridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Card key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}
