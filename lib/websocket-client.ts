let socket: WebSocket | null = null;

type Callback = (data: Record<string, unknown>) => void;
const listeners: Set<Callback> = new Set();

export function connectWebSocket(): void {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (!baseWsUrl) throw new Error("WebSocket URL is not configured.");

  socket = new WebSocket(`${baseWsUrl}/ws`);

  socket.onopen = () => {};

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (err) {
          console.error("❗ Listener error:", err);
        }
      });
    } catch {
      console.warn("❗ Invalid WebSocket message:", event.data);
    }
  };

  socket.onerror = (error) => {
    console.error("❗ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.warn("❌ WebSocket disconnected.");
    socket = null;
  };
}

export function onMessage(callback: Callback): () => void {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}
