"use client";

import { ChatWindow } from "@/components/ChatWindow/ChatWindow";

export default function Home() {
  return (
    <main
      id="main-content"
      className="fixed inset-0 flex flex-col bg-[#eceeef]"
      style={{
        backgroundImage: "url(/assets/body-bg.jpg)",
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only skip-to-main">
        Skip to main content
      </a>
      <ChatWindow />
    </main>
  );
}
