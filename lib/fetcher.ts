// lib/fetcher.ts

export type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown> | string | null;
  headers?: HeadersInit;
};

// FetchError 제네릭으로 타입 강화
export class FetchError<T = unknown> extends Error {
  status: number;
  body: T;

  constructor(message: string, status: number, body: T) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// fetcher 함수 정의
export async function fetcher<T>(
  path: string,
  options: FetcherOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body:
      options.method === "GET"
        ? undefined
        : options.body != null
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text(); // fallback to text
    }
    throw new FetchError("Request failed", res.status, errorBody);
  }

  return res.json();
}
