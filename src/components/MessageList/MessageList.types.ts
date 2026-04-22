
export interface IMessageListProps {
  messages: IMessage[];
  isLoading?: boolean;
  error?: string | null;
  onReachTop?: () => void;
  isFetchingPrevious?: boolean;
}

export interface IMessage {
  id: string;
  message: string;
  author: string;
  timestamp: string;
}
