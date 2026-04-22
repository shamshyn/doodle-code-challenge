"use client";

import { ChatWindow } from "@/components/ChatWindow/ChatWindow";

export default function Home() {
  return (
    <main
      id="main-content"
      className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#eceeef] app-bg"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only skip-to-main"
      >
        Skip to main content
      </a>
      <ChatWindow />
    </main>
  );
}
