import { UIEvent, forwardRef, useCallback } from "react";
import { IMessageListProps } from "./MessageList.types";
import { MessageBubble } from "../MessageBubble/MessageBubble";

/**
 * MessageList displays a scrollable list of chat messages.
 * Handles scroll-to-bottom on new messages and triggers pagination when scrolled to top.
 */
export const MessageList = forwardRef<HTMLDivElement, IMessageListProps>(
  function MessageList(
    {
      messages,
      isLoading = false,
      error = null,
      onReachTop,
      isFetchingPrevious = false,
    },
    scrollContainerRef,
  ) {
    const handleScroll = useCallback(
      (event: UIEvent<HTMLDivElement>) => {
        if (!onReachTop || isFetchingPrevious) {
          return;
        }

        if (event.currentTarget.scrollTop <= 0) {
          onReachTop();
        }
      },
      [isFetchingPrevious, onReachTop],
    );

    if (isLoading && messages.length === 0) {
      return (
        <section
          className="flex flex-1 items-center justify-center px-4 py-10 text-center text-[#a8b2bc]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          Loading messages...
        </section>
      );
    }

    if (error) {
      return (
        <section
          className="flex flex-1 items-center justify-center px-4 py-10 text-center text-[#d9534f]"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </section>
      );
    }

    if (messages.length === 0) {
      return (
        <section
          className="flex flex-1 items-center justify-center px-4 py-10 text-center text-[#a8b2bc]"
          role="status"
          aria-live="polite"
        >
          No messages yet. Start the conversation!
        </section>
      );
    }

    return (
      <section
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 pt-6 sm:px-6"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="false"
        tabIndex={0}
      >
        <div className="mx-auto w-full max-w-336">
          {isFetchingPrevious && (
            <p className="pb-4 text-center text-sm text-[#a8b2bc] sm:text-base">
              Loading earlier messages...
            </p>
          )}
          <ul
            className="flex flex-col gap-4 sm:gap-5 pb-4 sm:pb-6"
            aria-label="Message list"
          >
            {messages.map((message) => (
              <li key={message.id}>
                <MessageBubble
                  message={message}
                  isSender={message.author.toLowerCase() === "you"}
                />
              </li>
            ))}
          </ul>
          <p className="sr-only" role="status">
            {messages.length} messages in conversation
          </p>
        </div>
      </section>
    );
  },
);
