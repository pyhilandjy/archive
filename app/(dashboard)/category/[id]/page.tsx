"use client";

import { use } from "react";
import { Grid } from "@/app/(dashboard)/main/components/list-grid";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { useInfiniteContents } from "@/hooks/use-infinite-media";
import { PostButton } from "./components/post-button";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteContents(id);

  const items = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <PostButton />
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
  );
}
