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
  id: string; // contents_id가 아닌 id로 통일
  contents_id?: string; // 백엔드에서 보내는 필드
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
  const record = data as Record<string, unknown>;
  return (
    typeof data === "object" &&
    data !== null &&
    record.type === "status_update" &&
    typeof record.contents_id === "string" &&
    typeof record.status === "string"
  );
}

export const useWebSocket = (categoryId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    connectWebSocket();
    const unsubscribe = onMessage((data: unknown) => {
      if (isStatusUpdateMessage(data)) {
        const possibleKeys = [
          ["contents", categoryId],
          ["contents"],
          ["contents", categoryId, "list"],
          ["infinite-contents", categoryId],
          ["media", categoryId],
        ];

        let foundData = false;

        for (const queryKey of possibleKeys) {
          const existingData = queryClient.getQueryData(queryKey) as QueryData;

          if (existingData?.pages) {
            foundData = true;

            // 데이터 업데이트
            queryClient.setQueryData(queryKey, (prev: unknown) => {
              const prevData = prev as QueryData;

              const newPages = prevData.pages.map((page) => ({
                ...page,
                items: page.items.map((item) => {
                  const matches =
                    item.id === data.contents_id ||
                    item.contents_id === data.contents_id;

                  if (matches) {
                    return { ...item, status: data.status };
                  }
                  return item;
                }),
              }));

              return {
                ...prevData,
                pages: newPages,
              };
            });
            break;
          }
        }

        if (!foundData) {
          console.warn("⚠️ No existing data found, checking all queries...");

          // fallback: 모든 contents 관련 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: ["contents"],
            exact: false, // 하위 키도 모두 포함
          });
        }
      } else {
        console.warn("❌ Invalid message structure. Ignored.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [categoryId, queryClient]);
};
