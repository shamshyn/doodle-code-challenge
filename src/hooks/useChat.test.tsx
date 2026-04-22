import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChat } from "./useChat";

// Mock API
jest.mock("@/lib/api", () => ({
  getMessages: jest.fn(async () => ({
    messages: [
      {
        id: "1",
        message: "Test",
        author: "You",
        timestamp: new Date().toISOString(),
      },
    ],
    previousCursor: undefined,
  })),
  postMessage: jest.fn(
    async ({ message, author }: { message: string; author: string }) => ({
      message: {
        id: "2",
        message,
        author,
        timestamp: new Date().toISOString(),
      },
    }),
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("useChat", () => {
  it("fetches messages", async () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });
  });

  it("sends a message", async () => {
    const { result } = renderHook(() => useChat(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      result.current.sendMessage({ message: "Hello", author: "You" });
    });
    expect(result.current.isSending).toBe(false);
  });
});
