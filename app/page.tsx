"use client";

import { useState } from "react";

export default function Home() {

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<any[]>([]);

  const uploadDocument = async () => {

    const response = await fetch("http://localhost:8000/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });
  
    const data = await response.json();
  
    setMessage("Document uploaded successfully!");

    setTitle("");
    setContent("");
  };

  const askQuestion = async () => {

    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
  
    const data = await response.json();
  
    setAnswer(data.answer);
  
    setSources(data.sources);
  
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
        My Workspace
        </h1>

        <p className="text-zinc-400 mb-10">
          Your local AI knowledge assistant
        </p>

        <div className="space-y-6">

          <div>
            <label className="block mb-2 text-sm text-zinc-300">
              Document Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Engineering Handbook"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-300">
              Document Content
            </label>

            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your company document..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-white resize-none"
            />
          </div>

          <button
            onClick={uploadDocument}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Upload Document
          </button>

          {message && (
            <p className="text-green-400 mt-4">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}