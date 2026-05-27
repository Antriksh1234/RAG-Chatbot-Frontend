"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DocumentPage() {

  const [document, setDocument] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");

  const [editedContent, setEditedContent] = useState("");

  const params = useParams();

  useEffect(() => {

    const fetchDocument = async () => {

      const response = await fetch(
        `http://localhost:8000/documents/${params.id}`
      );

      const data = await response.json();

      setDocument(data);

      setEditedTitle(data.title);

      setEditedContent(data.content);
    };

    fetchDocument();

  }, [params.id]);

  if (!document) {

    return (
      <div className="min-h-screen bg-black text-white p-10">
        Loading document...
      </div>
    );
  }

  const saveDocument = async () => {

    const response = await fetch(
      `http://localhost:8000/documents/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      }
    );
  
    const data = await response.json();
  
    setDocument({
      ...document,
      title: editedTitle,
      content: editedContent,
    });
  
    setIsEditing(false);
  
    console.log(data);
  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6 gap-4">

          {isEditing ? (

            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-4xl font-bold outline-none focus:border-white"
            />

          ) : (

            <h1 className="text-5xl font-bold">
              {document.title}
            </h1>

          )}

          {!isEditing && (

            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
            >
              Edit Document
            </button>

          )}

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          {isEditing ? (

            <div>

              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[500px] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 outline-none focus:border-white text-zinc-200 leading-relaxed"
              />

              <div className="flex gap-4 mt-6">

                <button
                  onClick={saveDocument}
                  className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {

                    setEditedTitle(document.title);

                    setEditedContent(document.content);

                    setIsEditing(false);

                  }}
                  className="bg-zinc-800 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>

              </div>

            </div>

          ) : (

            <p className="whitespace-pre-wrap leading-relaxed text-zinc-200">
              {document.content}
            </p>

          )}

        </div>

      </div>

    </div>

  );
}