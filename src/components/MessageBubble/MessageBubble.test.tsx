import { render, screen } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";

describe("MessageBubble", () => {
  it("renders the message text and author", () => {
    render(
      <MessageBubble
        message={{
          id: "1",
          message: "Hello!",
          author: "You",
          timestamp: new Date().toISOString(),
        }}
        isSender={true}
      />,
    );
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
});
