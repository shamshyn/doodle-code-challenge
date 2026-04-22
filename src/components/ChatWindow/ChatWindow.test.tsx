import { render, screen } from "@testing-library/react";
import { ChatWindow } from "./ChatWindow";

jest.mock("../../hooks/useChat", () => ({
  useChat: () => ({
    messages: [
      {
        id: "1",
        message: "Hello!",
        author: "You",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        message: "Hi!",
        author: "Bot",
        timestamp: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    sendMessage: jest.fn(),
    isSending: false,
  }),
}));

describe("ChatWindow", () => {
  it("renders chat messages and input", () => {
    render(<ChatWindow />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
