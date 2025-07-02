import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectWebSocket, onMessage } from "@/lib/websocket-client";

interface StatusUpdateMessage {
  type: "status_update";
  contents_id: string;
  status: string;
  [key: string]: unknown;
}

interface ContentsItem {
  contents_id: string;
  status: string;
  [key: string]: unknown;
}

interface PageData {
  items: ContentsItem[];
}

interface QueryData {
  pages: PageData[];
  pageParams: unknown[];
}

function isStatusUpdateMessage(data: unknown): data is StatusUpdateMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).type === "status_update" &&
    typeof (data as Record<string, unknown>).contents_id === "string" &&
    typeof (data as Record<string, unknown>).status === "string"
  );
}

export const useWebSocket = (categoryId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    connectWebSocket();

    const unsubscribe = onMessage((data: unknown) => {
      if (isStatusUpdateMessage(data)) {
        queryClient.setQueryData(["contents", categoryId], (prev: unknown) => {
          const prevData = prev as QueryData;
          if (!prevData?.pages) return prev;

          const newPages = prevData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.contents_id === data.contents_id
                ? { ...item, status: data.status }
                : item
            ),
          }));

          return {
            ...prevData,
            pages: newPages,
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [categoryId, queryClient]);
};
