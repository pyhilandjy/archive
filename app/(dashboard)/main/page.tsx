"use client";

import { Grid } from "./components/list-grid";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useInfiniteContents } from "@/hooks/use-infinite-media";
import { useWebSocket } from "@/hooks/use-websocket";

export default function MainPage() {
  useWebSocket();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteContents();

  const items = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">최근 업로드</h1>
      <Grid items={items} />
      {isLoading && <p>로딩 중...</p>}
      {isFetchingNextPage && <p>추가 로딩 중...</p>}
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={!!hasNextPage}
        isLoading={isFetchingNextPage || isLoading}
      />
    </div>
  );
}
