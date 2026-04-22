import { useCallback, useMemo } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getMessages, postMessage } from "@/lib/api";
import {
  GetMessagesResponse,
  Message,
  PostMessageRequest,
  PostMessageResponse,
} from "@/lib/types";

const MESSAGES_QUERY_KEY = "messages";
const MESSAGES_PAGE_SIZE = 20;

/**
 * useChat is the main chat state hook.
 * Handles fetching, pagination, and sending messages using React Query.
 */
export const useChat = () => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    GetMessagesResponse,
    Error,
    InfiniteData<GetMessagesResponse, string | undefined>,
    string[],
    string | undefined
  >({
    queryKey: [MESSAGES_QUERY_KEY],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return getMessages({ limit: MESSAGES_PAGE_SIZE, before: pageParam });
    },
    getNextPageParam: (lastPage) => lastPage.previousCursor,
    initialPageParam: undefined,
    retry: 1,
    refetchInterval: (query) => (query.state.status === "error" ? false : 3000),
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  // Mutation for sending a new message
  const sendMessageMutation = useMutation<
    PostMessageResponse,
    Error,
    PostMessageRequest
  >({
    mutationFn: postMessage,
    onSuccess: (newMessage) => {
      queryClient.setQueryData<InfiniteData<GetMessagesResponse, string | undefined>>(
        [MESSAGES_QUERY_KEY],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                {
                  messages: [newMessage.message],
                  nextCursor: undefined,
                  previousCursor: undefined,
                },
              ],
              pageParams: [undefined],
            };
          }

          if (oldData.pages.length === 0) {
            return {
              ...oldData,
              pages: [
                {
                  messages: [newMessage.message],
                  nextCursor: undefined,
                  previousCursor: undefined,
                },
              ],
              pageParams: [undefined],
            };
          }

          const newPages = oldData.pages.map((page, index: number) => {
            if (index === 0) {
              return {
                ...page,
                messages: [...page.messages, newMessage.message],
              };
            }

            return page;
          });

          return { ...oldData, pages: newPages };
        },
      );
    },
  });

  const sendMessage = useCallback(
    async (payload: PostMessageRequest): Promise<boolean> => {
      sendMessageMutation.reset();

      try {
        await sendMessageMutation.mutateAsync(payload);
        return true;
      } catch {
        return false;
      }
    },
    [sendMessageMutation],
  );

  // Flatten and sort all messages by timestamp
  const messages: Message[] = useMemo(() => {
    return [...(data?.pages.flatMap((page) => page.messages) ?? [])].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
  }, [data]);

  return {
    messages,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.isError ? sendMessageMutation.error : null,
  };
}
