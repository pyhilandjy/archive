import { useEffect } from "react";
import {
  connectWebSocket,
  // disconnectWebSocket,
  onMessage,
} from "@/lib/websocket-client";
import { useQueryClient } from "@tanstack/react-query";

export const useWebSocket = (categoryId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    connectWebSocket();

    const unsubscribe = onMessage((data: Record<string, unknown>) => {
      if (data.type === "status_update") {
        queryClient.invalidateQueries({
          queryKey: ["contents", categoryId],
        });
      }
    });

    return () => {
      unsubscribe();
      // disconnectWebSocket();
    };
  }, [categoryId, queryClient]);
};
