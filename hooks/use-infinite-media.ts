import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getUsersContentsList,
  getUsersCategoryContentsList,
} from "@/lib/contents-list-api";

export function useInfiniteContents(categoryId?: string, pageSize: number = 9) {
  return useInfiniteQuery({
    queryKey: ["contents", categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const data = categoryId
        ? await getUsersCategoryContentsList(categoryId)
        : await getUsersContentsList();
      //   const data = await getUsersCategoryContentsList(categoryId);

      const start = (pageParam - 1) * pageSize;
      const end = start + pageSize;
      return {
        items: data.slice(start, end),
        nextPage: end < data.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}
