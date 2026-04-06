/**
 * src/lib/api.ts
 * 
 * Centralized API service for all backend gateway calls.
 * All chat requests route through this file — no direct AI provider calls
 * are made from the frontend.
 * 
 * Base URL is read from the environment variable NEXT_PUBLIC_API_BASE_URL.
 * See .env.example for configuration.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://system.prism-llm.tech:8080';

/** Timeout for non-streaming requests (ms) */
const REQUEST_TIMEOUT_MS = 30_000;

/** Timeout for the first byte of a streaming response (ms) */
const STREAM_INITIAL_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatApiMessage[];
}

export interface ChatResponse {
  /** The assistant reply text */
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a fetch AbortController that automatically cancels after `ms`.
 * Callers may also pass their own signal to cancel manually (e.g. component unmount).
 */
function makeAbortController(ms: number, externalSignal?: AbortSignal): AbortController {
  const controller = new AbortController();

  // Auto-timeout
  const timeoutId = setTimeout(() => controller.abort(), ms);
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));

  // Forward external abort
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort());
    }
  }

  return controller;
}

/**
 * Translate HTTP error status codes into human-readable messages.
 */
function httpErrorMessage(status: number): string {
  if (status === 429) return 'Rate limit reached. Please wait a moment and try again.';
  if (status >= 500 && status < 600) return `Backend error (${status}). The server encountered a problem. Please try again.`;
  if (status === 401 || status === 403) return `Unauthorized request (${status}). Check your configuration.`;
  return `Unexpected response from server (${status}).`;
}

// ---------------------------------------------------------------------------
// POST /v1/chat  — non-streaming
// ---------------------------------------------------------------------------

/**
 * Send a chat request and receive the full response at once.
 *
 * @throws {Error} on network failure, timeout, or non-2xx HTTP status
 */
export async function postChat(
  payload: ChatRequest,
  externalSignal?: AbortSignal,
): Promise<ChatResponse> {
  const controller = makeAbortController(REQUEST_TIMEOUT_MS, externalSignal);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/chat`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw new Error(`Network error: ${err?.message || 'Unable to reach the server.'}`);
  }

  if (!response.ok) {
    throw new Error(httpErrorMessage(response.status));
  }

  try {
    const data = await response.json();
    // Support both { content: "..." } and { message: { content: "..." } }
    const content =
      data?.content ??
      data?.message?.content ??
      data?.choices?.[0]?.message?.content ??
      '';
    return { content };
  } catch {
    throw new Error('Failed to parse response from server.');
  }
}

// ---------------------------------------------------------------------------
// POST /v1/chat/stream  — Server-Sent Events (SSE)
// ---------------------------------------------------------------------------

/**
 * Send a chat request and receive the response as a streaming SSE feed.
 *
 * Each `data:` line is expected to be JSON: `{ "delta": "<text>" }`.
 * The stream ends when a `data: [DONE]` line is received.
 *
 * Falls back to `postChat` automatically if the server returns a
 * non-streaming response (Content-Type: application/json).
 *
 * @param payload     - The chat request body
 * @param onChunk     - Called with each incremental text chunk
 * @param externalSignal - Optional AbortSignal to cancel the stream
 * @throws {Error} on network failure, timeout, or non-2xx HTTP status
 */
export async function streamChat(
  payload: ChatRequest,
  onChunk: (chunk: string) => void,
  externalSignal?: AbortSignal,
): Promise<void> {
  const controller = makeAbortController(STREAM_INITIAL_TIMEOUT_MS, externalSignal);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/chat/stream`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: any) {
    // Fallback to non-streaming if stream endpoint is unavailable
    if (err?.name !== 'AbortError') {
      const result = await postChat(payload, externalSignal);
      onChunk(result.content);
      return;
    }
    throw new Error('Stream request timed out. Please check your connection and try again.');
  }

  if (!response.ok) {
    // Try fallback to /v1/chat on 404 (endpoint might not exist)
    if (response.status === 404) {
      const result = await postChat(payload, externalSignal);
      onChunk(result.content);
      return;
    }
    throw new Error(httpErrorMessage(response.status));
  }

  const contentType = response.headers.get('content-type') || '';

  // If server returned JSON instead of SSE, parse it directly
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const content =
      data?.content ??
      data?.message?.content ??
      data?.choices?.[0]?.message?.content ??
      '';
    onChunk(content);
    return;
  }

  // Parse SSE stream
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Stream response body is empty.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Keep the last (potentially incomplete) line in buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue; // skip comments / keep-alive

        if (trimmed === 'data: [DONE]') return;

        if (trimmed.startsWith('data: ')) {
          const raw = trimmed.slice('data: '.length);
          try {
            const parsed = JSON.parse(raw);
            // Support { delta: "..." } or { content: "..." } or OpenAI-style choices
            const chunk =
              parsed?.delta ??
              parsed?.content ??
              parsed?.choices?.[0]?.delta?.content ??
              '';
            if (chunk) onChunk(chunk);
          } catch {
            // Plain-text delta (non-JSON SSE)
            if (raw && raw !== '[DONE]') onChunk(raw);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
