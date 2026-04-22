import { FC } from "react";

import { formatTimestamp } from "./MessageBubble.utils";
import { IMessageBubbleProps } from "./MessageBubble.types";

/**
 * MessageBubble represents a single chat message, styled differently for sender vs receiver.
 * It displays the message text, author (for received messages), and a timestamp.
 */
export const MessageBubble: FC<IMessageBubbleProps> = ({
  message,
  isSender,
}) => (
  <article
    className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
    aria-label={isSender ? "Your message" : `Message from ${message.author}`}
  >
    <div
      className={[
        "rounded-lg border p-4",
        "max-w-75 sm:max-w-[20rem] md:max-w-88 lg:max-w-208",
        isSender
          ? "border-[#d8d39e] bg-[#f0ebb8] mt-2"
          : "border-[#c6cdd3] bg-[#f3f5f7]",
      ].join(" ")}
    >
      {!isSender && (
        <p className="mb-1 text-[1rem] leading-tight text-[#aeb8c1] sm:text-[1.125rem] wrap-break-word">
          {message.author}
        </p>
      )}

      <p className="text-[1.0625rem] leading-[1.45] wrap-break-word text-[#46505c] sm:text-[1.25rem]">
        {message.message}
      </p>

      <p
        className={`mt-3 text-[0.9375rem] leading-none text-[#a8b2bc] sm:text-[1.0625rem] ${
          isSender ? "text-right" : "text-left"
        }`}
      >
        <time dateTime={message.timestamp}>
          {formatTimestamp(message.timestamp)}
        </time>
      </p>
    </div>
  </article>
);
