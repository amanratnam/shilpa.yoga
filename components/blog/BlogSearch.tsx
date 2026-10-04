"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Search-as-you-type for the journal. The query lives in the URL (`?q=`), so
 * results are server-rendered, shareable and survive a refresh; the form still
 * submits normally if JavaScript has not loaded yet.
 */
export function BlogSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => clearTimeout(debounce.current), []);

  const navigate = (next: string) => {
    const q = next.trim();
    // A new query always starts from the first page of results.
    const href = q ? `/blog?q=${encodeURIComponent(q)}` : "/blog";
    startTransition(() => router.replace(href, { scroll: false }));
  };

  const onChange = (next: string) => {
    setValue(next);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => navigate(next), 300);
  };

  const clear = () => {
    setValue("");
    clearTimeout(debounce.current);
    navigate("");
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      action="/blog"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(debounce.current);
        navigate(value);
        // Close the on-screen keyboard so the results are visible.
        inputRef.current?.blur();
        document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="group relative"
    >
      <label htmlFor="blog-search" className="sr-only">
        Search the journal
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-stone transition-colors group-focus-within:text-brand-green"
        strokeWidth={2}
        aria-hidden
      />
      <input
        ref={inputRef}
        id="blog-search"
        name="q"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes: back pain, breath, beginners…"
        // 16px text stops iOS Safari zooming the page on focus.
        className={cn(
          "h-14 w-full rounded-brand border border-transparent bg-brand-white pl-12 pr-12 text-base text-brand-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)] placeholder:text-brand-stone/80",
          "transition-shadow duration-300 ease-brand focus:border-brand-gold focus:outline-none focus:ring-4 focus:ring-brand-gold/30",
          // The native clear button doubles up with ours.
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        {pending ? (
          <span className="grid h-10 w-10 place-items-center text-brand-stone">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} aria-hidden />
            <span className="sr-only">Searching</span>
          </span>
        ) : value ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="grid h-10 w-10 place-items-center rounded-brand text-brand-stone transition-colors hover:bg-brand-cream hover:text-brand-ink"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </div>
    </form>
  );
}
