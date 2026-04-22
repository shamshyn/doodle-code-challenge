import {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IMessageInputProps } from "./MessageInput.types";

/**
 * MessageInput provides a text input and send button for composing messages.
 * It handles form submission and calls the provided onSendMessage callback.
 */
export const MessageInput: FC<IMessageInputProps> = ({
  onSendMessage,
  isLoading = false,
  isDisabled = false,
}) => {
  const [message, setMessage] = useState("");
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedMessage = message.trim();
      if (!trimmedMessage || isLoading || isDisabled) {
        return;
      }

      try {
        const didSend = await onSendMessage(trimmedMessage, "You");
        if (didSend !== false) {
          setMessage("");
          messageInputRef.current?.focus();
        }
      } catch {
        // Keep the draft in the input if sending fails unexpectedly.
      }
    },
    [isDisabled, isLoading, message, onSendMessage],
  );

  useEffect(() => {
    messageInputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[#318abc] bg-[#3b95ca] shrink-0"
      aria-label="Send a message"
    >
      <div className="mx-auto w-full max-w-336 p-2 sm:p-4 2xl:px-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <label htmlFor="message-input" className="sr-only">
            Message
          </label>

          <input
            id="message-input"
            ref={messageInputRef}
            type="text"
            placeholder="Message"
            autoComplete="off"
            value={message}
            onChange={handleChange}
            disabled={isLoading || isDisabled}
            aria-describedby="message-input-help"
            className="h-16 min-w-0 flex-1 rounded-md border-2 border-[#2d79a8] bg-[#f6f6f7] px-4 text-[1.125rem] text-[#46505c] placeholder:text-[#a8b2bc] focus:outline-none sm:h-21 sm:text-[1.5rem]"
          />

          <span id="message-input-help" className="sr-only">
            Type a message and press enter or use the send button.
          </span>

          <button
            type="submit"
            disabled={!message.trim() || isLoading || isDisabled}
            className="h-16 shrink-0 rounded-md bg-[#fa8568] px-6 text-[1.125rem] font-semibold text-white transition-colors hover:bg-[#f47258] disabled:cursor-not-allowed disabled:bg-[#c7cdd3] sm:h-21 sm:min-w-40 sm:px-8 sm:text-[1.5rem]"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};
