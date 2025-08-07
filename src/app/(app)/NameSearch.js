"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NameSearch({ initialQuery }) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);

  function handleSearch(e) {
    e.preventDefault();
    if (query) {
      router.push(`/?to=${query}`);
    } else {
      router.push(`/`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <Input
          name="name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your name to find a mixtape..."
          className="text-lg py-6"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
