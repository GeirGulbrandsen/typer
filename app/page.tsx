import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-14 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-center mb-6">+1 Testing</h1>
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <p className="text-2xl font-semibold text-center">Under Construction</p>

        <div className="flex justify-center w-full">
          <Link
            href="/typing-trainer"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            Typing Trainer
          </Link>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content removed */}
      </footer>
    </div>
  );
}
