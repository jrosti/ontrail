// Simple in-memory SSE pub/sub

export interface SseController {
  enqueue: (data: string) => void;
  close: () => void;
}

// Map of userId -> set of SSE controllers
const sseClients = new Map<string, Set<SseController>>();

export function registerSseClient(userId: string, controller: SseController): () => void {
  let clients = sseClients.get(userId);
  if (!clients) {
    clients = new Set();
    sseClients.set(userId, clients);
  }
  clients.add(controller);
  return () => {
    clients?.delete(controller);
    if (clients?.size === 0) {
      sseClients.delete(userId);
    }
  };
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  const clients = sseClients.get(userId);
  if (!clients) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.enqueue(payload);
    } catch {
      // client disconnected
    }
  }
}
