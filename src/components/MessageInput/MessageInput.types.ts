export interface IMessageInputProps {
  onSendMessage: (message: string, author: string) => void;
  isLoading?: boolean;
}
