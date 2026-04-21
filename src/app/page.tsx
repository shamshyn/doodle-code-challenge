"use client";

import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/assets/body-bg.jpg)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="mx-auto h-screen w-full">
        <ChatWindow />
      </div>
    </main>
  );
}
