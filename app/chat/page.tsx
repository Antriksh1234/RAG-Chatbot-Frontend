"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ChatPage() {

  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  
  }, [messages]);

  const askQuestion = async () => {

    if (!query.trim()) {
      return;
    }
  
    const currentQuery = query;
  
    setQuery("");
    setLoading(true);
  
    setMessages((prev) => [
      ...prev,
  
      {
        role: "user",
        content: currentQuery
      },
  
      {
        role: "assistant",
        content: ""
      }
    ]);
  
    try {
  
      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: currentQuery,
            history: messages.slice(-6),
          }),
        }
      );

      const sourcesHeader =
        response.headers.get("X-Sources");

      const sources = sourcesHeader
        ? JSON.parse(sourcesHeader)
        : [];
  
      if (!response.body) {
        return;
      }
  
      const reader = response.body.getReader();
  
      const decoder = new TextDecoder();
  
      let streamedAnswer = "";
  
      while (true) {
  
        const { done, value } = await reader.read();
  
        if (done) {
          break;
        }
  
        const chunk = decoder.decode(value);
  
        streamedAnswer += chunk;
  
        setMessages((prev) => {
  
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: streamedAnswer,
            sources
          };
  
          return updated;
        });
      }
  
    } catch (error) {
  
      console.error(error);
  
    } finally {
  
      setLoading(false);
  
    }
  };

  return (

    <div className="h-full bg-black text-white flex flex-col">
  
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
  
        <div className="max-w-4xl mx-auto p-8 h-full">
  
          {messages.length === 0 ? (
  
            <div className="h-full flex flex-col items-center justify-start pt-32 text-center">
  
              <Image
                src="/pandu-ai-logo.png"
                alt="Pandu AI"
                width={100}
                height={100}
                className="rounded-full mb-1"
              />
  
              <h1 className="text-4xl font-bold mb-4">
                Pandu AI
              </h1>
  
              <p className="text-zinc-400 text-lg max-w-xl">
                Ask questions from your uploaded documents and workspace knowledge base.
              </p>
  
            </div>
  
          ) : (
  
            <div className="space-y-6 py-8">
  
              {messages.map((message, index) => (
  
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
  
                  <div
                    className={`max-w-2xl rounded-2xl px-5 py-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-900 border border-zinc-800 text-white"
                    }`}
                  >
  
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
  
                    {message.sources && message.sources.length > 0 && (
  
                      <div className="mt-6">
  
                        <p className="text-sm text-zinc-400 mb-3">
                          Sources
                        </p>
  
                        <div className="flex flex-wrap gap-2">
  
                          {message.sources.map((source: any, sourceIndex: number) => (
  
                            <a
                              key={sourceIndex}
                              href={`/documents/${source.document_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-zinc-800 px-3 py-2 rounded-full text-sm hover:bg-zinc-700 transition"
                            >
                              {source.document_title}
                            </a>
  
                          ))}
  
                        </div>
  
                      </div>
  
                    )}
  
                  </div>
  
                </div>
  
              ))}

              <div ref={bottomRef} />
  
            </div>
  
          )}
  
        </div>
  
      </div>
  
      {/* Bottom Input */}
      <div className="border-t border-zinc-800 bg-black p-6">
  
        <div className="max-w-4xl mx-auto flex gap-4">
  
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Pandu AI..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-white"
          />
  
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Ask
          </button>
  
        </div>
  
      </div>
  
    </div>
  
  );
}