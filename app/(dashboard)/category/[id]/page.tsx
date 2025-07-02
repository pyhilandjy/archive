"use client";

import { use } from "react";
import { useState } from "react";
import { Grid } from "../../main/components/list-grid";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useInfiniteContents } from "@/hooks/use-infinite-media";
import { PostButton } from "./components/post-button";
import { PostModal } from "./components/post-modal";
import { useWebSocket } from "@/hooks/use-websocket";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [open, setOpen] = useState(false);

  useWebSocket(id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteContents(id);

  const items = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <PostButton onClick={() => setOpen(true)} />
        </div>
        <Grid items={items} />
        {isLoading && <p>로딩 중...</p>}
        {isFetchingNextPage && <p>추가 로딩 중...</p>}
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage || isLoading}
        />
      </div>

      <PostModal open={open} onOpenChange={setOpen} categoryId={id} />
    </>
  );
}
