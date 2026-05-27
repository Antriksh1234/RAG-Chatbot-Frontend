"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DocumentsPage() {

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {

    const fetchDocuments = async () => {

      const response = await fetch(
        "http://localhost:8000/documents"
      );

      const data = await response.json();

      setDocuments(data);
    };

    fetchDocuments();

  }, []);

  return (

    <div className="h-full overflow-y-auto bg-black text-white">

      <div className="max-w-5xl mx-auto p-8 pb-32">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-4xl font-bold mb-2">
              Pandu Workspace
            </h1>

            <p className="text-zinc-400">
              Browse your knowledge base documents
            </p>

          </div>

          <Link
            href="/"
            className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Create Document
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {documents.map((document) => (

            <Link
              key={document.id}
              href={`/documents/${document.id}`}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition"
            >

              <h2 className="text-2xl font-semibold mb-4">
                {document.title}
              </h2>

              <p className="text-zinc-400 text-sm">
                Created At:
              </p>

              <p className="text-zinc-300 mt-1">
                {new Date(document.created_at).toLocaleString()}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );
}