import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getUsersContentsList,
  getUsersCategoryContentsList,
} from "@/lib/contents-list-api";

export function useInfiniteContents(categoryId?: string, pageSize: number = 9) {
  return useInfiniteQuery({
    queryKey: ["contents", categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const fullList = categoryId
        ? await getUsersCategoryContentsList(categoryId)
        : await getUsersContentsList();

      const start = (pageParam - 1) * pageSize;
      const end = start + pageSize;
      const items = fullList.slice(start, end);

      return {
        items,
        total: fullList.length,
        nextPage: end < fullList.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}
