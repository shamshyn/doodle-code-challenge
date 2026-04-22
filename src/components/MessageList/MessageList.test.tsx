import { render, screen } from "@testing-library/react";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  it("renders loading state", () => {
    render(<MessageList messages={[]} isLoading={true} />);
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<MessageList messages={[]} error="Something went wrong" />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  it("renders messages", () => {
    render(
      <MessageList
        messages={[
          { id: "1", message: "Hello", author: "You", timestamp: new Date().toISOString() },
          { id: "2", message: "Hi", author: "Bot", timestamp: new Date().toISOString() },
        ]}
      />
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });
});
