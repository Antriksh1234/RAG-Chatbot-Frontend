"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {

  const pathname = usePathname();

  const isChatPage = pathname === "/chat";

  return (

    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800">

      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Image
            src="/pandu-ai-logo.png"
            alt="Pandu AI Logo"
            width={36}
            height={36}
            className="rounded-full"
          />

          <h1 className="text-2xl font-bold">
            {isChatPage ? "Pandu AI" : "Pandu Workspace"}
          </h1>

        </div>

        <div className="flex items-center gap-6">

          <Link
            href="/documents"
            className="text-zinc-300 hover:text-white transition"
          >
            Documents
          </Link>

          <Link
            href="/chat"
            className="text-zinc-300 hover:text-white transition"
          >
            Pandu AI
          </Link>

          <Link
            href="/"
            className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Create Document
          </Link>

        </div>

      </div>

    </nav>

  );
}