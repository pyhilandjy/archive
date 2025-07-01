import { ContentsList } from "@/lib/contents-list-api";
import { Card } from "./list-card";

interface GridProps {
  items: ContentsList[];
  onDeleteItem?: (id: string) => void;
}

export function Grid({ items, onDeleteItem }: GridProps) {
  const handleDelete = (id: string) => {
    if (onDeleteItem) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Card key={`${item.id}-${index}`} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
