import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { MessageInput } from "./MessageInput";

import "@testing-library/jest-dom";

describe("MessageInput", () => {
  it("renders input and button", () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={false} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onSendMessage when submitting", async () => {
    const onSendMessage = jest.fn(async () => true);
    render(<MessageInput onSendMessage={onSendMessage} isLoading={false} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hi" } });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith("Hi", expect.any(String));
    });
  });
});
