"use client";

import React, { useState, useEffect, useRef, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRepeatAction, searchSongsAction } from "./action";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function RepeatForm({ username }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(
    async (prevState, formData) => {
      const result = await createRepeatAction(prevState, formData);
      if (result?.message) {
        toast.success(result.message);
        router.refresh();
        formRef.current?.reset();
        setSelectedSong(null);
      }
      if (result?.error) {
        toast.error(result.error);
      }
      return result;
    },
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const searchTimeout = setTimeout(async () => {
      const results = await searchSongsAction(searchQuery);
      setSearchResults(results);
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 border bg-slate-50 dark:bg-slate-900 p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-4">What's on repeat?</h2>
      <Textarea
        name="message"
        placeholder="Share a feeling, a memory, a thought..."
        required
      />

      {selectedSong && (
        <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
          <Image
            src={selectedSong.coverUrl}
            alt={selectedSong.title}
            width={40}
            height={40}
            className="rounded-md"
          />
          <div className="text-sm">
            <p className="font-semibold">{selectedSong.title}</p>
            <p className="text-muted-foreground">{selectedSong.artist}</p>
          </div>
        </div>
      )}

      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a song..."
          required={!selectedSong}
          autoComplete="off"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-10">
            {searchResults.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer"
              >
                <Image
                  src={song.coverUrl}
                  alt={song.title}
                  width={40}
                  height={40}
                  className="rounded-sm"
                />
                <div className="text-sm">
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-muted-foreground">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSong && (
        <>
          <input
            type="hidden"
            name="song"
            value={`${selectedSong.title} - ${selectedSong.artist}`}
          />
          <input type="hidden" name="cover" value={selectedSong.coverUrl} />
        </>
      )}

      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Avatar size={20} name={username} variant="beam" />
          Posting as {username}
        </div>
        <Button type="submit" disabled={pending || !selectedSong}>
          {pending ? "Sharing..." : "Share Repeat"}
        </Button>
      </div>
    </form>
  );
}
