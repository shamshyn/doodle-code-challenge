export interface IMessageInputProps {
  onSendMessage: (
    message: string,
    author: string,
  ) => void | boolean | Promise<void | boolean>;
  isLoading?: boolean;
  isDisabled?: boolean;
}
