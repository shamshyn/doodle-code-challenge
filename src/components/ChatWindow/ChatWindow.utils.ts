import { API_ORIGIN, BASE_URL } from "@/lib/api";

export const getReadableErrorMessage = (rawMessage?: string): string => {
  if (!rawMessage) {
    return "Unable to load messages right now.";
  }

  if (rawMessage.includes("404") || rawMessage.includes("Not Found")) {
    return `Backend API not found at ${BASE_URL}. Start the challenge API on ${API_ORIGIN} and verify your NEXT_PUBLIC_CHAT_API_BASE_URL.`;
  }

  if (rawMessage.includes("401") || rawMessage.includes("Unauthorized")) {
    return "Authentication failed. Check NEXT_PUBLIC_CHAT_AUTH_TOKEN.";
  }

  if (rawMessage.includes("Failed to fetch")) {
    return `Cannot reach backend API at ${API_ORIGIN}. Ensure it is running and accessible from the browser.`;
  }

  return rawMessage;
}