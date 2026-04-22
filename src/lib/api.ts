import { ApiMessage, GetMessagesResponse, Message, PostMessageRequest, PostMessageResponse } from './types';

const API_ORIGIN = process.env.NEXT_PUBLIC_CHAT_API_ORIGIN ?? 'http://localhost:3000';
const RAW_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL;
const BASE_URL = RAW_BASE_URL
  ? (RAW_BASE_URL.startsWith('/')
    ? new URL(RAW_BASE_URL, API_ORIGIN).toString().replace(/\/$/, '')
    : RAW_BASE_URL.replace(/\/$/, ''))
  : `${API_ORIGIN}/api/v1`;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_CHAT_AUTH_TOKEN ?? 'super-secret-doodle-token';

export { API_ORIGIN, BASE_URL };

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

/**
 * normalizeMessage converts an ApiMessage from the backend into a Message used in the frontend.
 * It handles differences in field names and provides defaults for missing fields.
 * @param apiMessage The raw message object returned by the backend API
 * @returns A normalized Message object with consistent field names and types for frontend use
 */
function normalizeMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id ?? crypto.randomUUID(),
    message: apiMessage.message,
    author: apiMessage.author,
    timestamp: apiMessage.timestamp ?? apiMessage.createdAt ?? new Date().toISOString(),
  };
}

/**
 * normalizeGetMessagesResponse takes the raw response from the getMessages API call and transforms it into a GetMessagesResponse.
 * It ensures that the messages array is properly normalized and that pagination cursors are included if present.
 * @param data The raw response data from the getMessages API endpoint
 * @returns A GetMessagesResponse object with normalized messages and pagination info
 */
function normalizeGetMessagesResponse(data: unknown): GetMessagesResponse {
  if (typeof data !== 'object' || data === null) {
    return { messages: [] };
  }

  const payload = data as {
    messages?: ApiMessage[];
    nextCursor?: string;
    previousCursor?: string;
  };

  return {
    messages: Array.isArray(payload.messages) ? payload.messages.map(normalizeMessage) : [],
    nextCursor: payload.nextCursor,
    previousCursor: payload.previousCursor,
  };
}

/**
 * normalizePostMessageResponse takes the raw response from the postMessage API call and transforms it into a PostMessageResponse.
 * It ensures that the message object is properly normalized.
 * @param data The raw response data from the postMessage API endpoint
 * @returns A PostMessageResponse object with a normalized message
 */
function normalizePostMessageResponse(data: unknown): PostMessageResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Error posting message: invalid response payload');
  }

  const payload = data as { message?: ApiMessage };

  if (!payload.message) {
    throw new Error('Error posting message: missing message in response');
  }

  return {
    message: normalizeMessage(payload.message),
  };
}

/**
 * getMessages fetches a paginated list of chat messages from the backend API.
 * It accepts optional parameters for pagination and returns a normalized GetMessagesResponse.
 * @param params Optional parameters for pagination (limit, after, before)
 * @returns A promise that resolves to a GetMessagesResponse containing the messages and pagination info
 */
export async function getMessages(params?: { limit?: number; after?: string; before?: string }): Promise<GetMessagesResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.after) query.append('after', params.after);
  if (params?.before) query.append('before', params.before);

  const response = await fetch(`${BASE_URL}/messages?${query.toString()}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error fetching messages (${response.status}): ${response.statusText}`);
  }

  const data: unknown = await response.json();
  return normalizeGetMessagesResponse(data);
}

/**
 * postMessage sends a new chat message to the backend API.
 * It accepts a PostMessageRequest object and returns a normalized PostMessageResponse.
 * @param data The message data to be sent to the backend
 * @returns A promise that resolves to a PostMessageResponse containing the normalized message
 */
export async function postMessage(data: PostMessageRequest): Promise<PostMessageResponse> {
  const response = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error posting message (${response.status}): ${response.statusText}`);
  }

  const responsePayload: unknown = await response.json();
  return normalizePostMessageResponse(responsePayload);
}
