let socket: WebSocket | null = null;
type Callback = (data: Record<string, unknown>) => void;
const listeners: Callback[] = [];

export function connectWebSocket(): void {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (!baseWsUrl) {
    throw new Error("WebSocket URL is not configured.");
  }

  socket = new WebSocket(`${baseWsUrl}/ws`);

  socket.onopen = () => console.log("WebSocket connection established.");
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((callback) => callback(data));
    } catch {
      console.warn("Invalid WebSocket message received:", event.data);
    }
  };
  socket.onclose = () => {
    console.warn("WebSocket connection closed.");
    socket = null;
  };
  socket.onerror = (error) => console.error("WebSocket error:", error);
}

export function onMessage(callback: Callback): void {
  listeners.push(callback);
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}
