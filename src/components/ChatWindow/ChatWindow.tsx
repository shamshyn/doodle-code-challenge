import { FC, useCallback, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import { getReadableErrorMessage } from "./ChatWindow.utils";

/**
 * ChatWindow is the main component that composes MessageList and MessageInput.
 * It manages chat state using the useChat hook and handles message sending and pagination.
 */
export const ChatWindow: FC = () => {
  const {
    messages,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage,
    isSending,
  } = useChat();

  // Use a local ref for scrolling, pass to MessageList
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef(0);
  const shouldPreserveScrollRef = useRef(false);
  const wasNearBottomRef = useRef(true);
  const previousMessageIdsRef = useRef<string[]>([]);

  const handleReachTop = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }
    previousScrollHeightRef.current = element.scrollHeight;
    shouldPreserveScrollRef.current = true;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSendMessage = useCallback(
    (message: string, author: string) => {
      sendMessage({ message, author });
    },
    [sendMessage],
  );

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      wasNearBottomRef.current = distanceFromBottom < 120;
    };

    handleScroll();
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Always scroll to bottom on initial mount (first render)
  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    const currentIds = messages.map((message) => String(message.id));

    if (!element) {
      previousMessageIdsRef.current = currentIds;
      return;
    }

    const previousIds = previousMessageIdsRef.current;
    const firstPreviousId = previousIds[0];
    const firstCurrentId = currentIds[0];
    const lastPreviousId = previousIds[previousIds.length - 1];
    const lastCurrentMessage = messages[messages.length - 1];
    const lastCurrentId = currentIds[currentIds.length - 1];

    if (shouldPreserveScrollRef.current) {
      const scrollDifference =
        element.scrollHeight - previousScrollHeightRef.current;
      element.scrollTop += scrollDifference;
      shouldPreserveScrollRef.current = false;
    } else if (
      previousIds.length === 0 ||
      wasNearBottomRef.current ||
      lastCurrentMessage?.author === "You" ||
      (lastPreviousId !== lastCurrentId && firstPreviousId === firstCurrentId)
    ) {
      element.scrollTop = element.scrollHeight;
    }

    previousMessageIdsRef.current = currentIds;
  }, [messages]);

  const resolvedError = isError
    ? getReadableErrorMessage(error?.message)
    : null;

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full flex-col"
      aria-label="Chat interface"
      style={{ minHeight: 0 }}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={resolvedError}
          onReachTop={handleReachTop}
          isFetchingPrevious={isFetchingNextPage}
        />
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
    </section>
  );
};
