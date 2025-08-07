"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRepeatAction, searchSongsAction } from "./action";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useSound from "use-sound";

export function RepeatForm({ username }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [playSuccessSound] = useSound("/sounds/success.wav", { volume: 0.5 });
  const [playClickSound] = useSound("/sounds/click.wav", { volume: 0.5 });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleFormAction = async (formData) => {
    startTransition(async () => {
      const result = await createRepeatAction(formData);
      if (result?.message) {
        playSuccessSound();
        toast.success(result.message);
        formRef.current?.reset();
        setSelectedSong(null);
        router.push("/");
        router.refresh();
      }
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const searchTimeout = setTimeout(async () => {
      const result = await searchSongsAction(searchQuery);
      setSearchResults(Array.isArray(result.data) ? result.data : []);
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSelectSong = (song) => {
    playClickSound();
    setSelectedSong(song);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <form
      ref={formRef}
      action={handleFormAction}
      className="space-y-4 border-2 bg-background/50 border-border p-4 sm:p-6 rounded-lg shadow-pixel"
    >
      <div className="space-y-1">
        <label htmlFor="to" className="text-sm font-medium text-primary">
          To (Player 2's Name)
        </label>
        <Input
          name="to"
          id="to"
          placeholder="lover"
          required
          className="bg-background/80"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-primary">
          Your Message
        </label>
        <Textarea
          name="message"
          id="message"
          placeholder="Share a feeling, a memory, a thought..."
          required
          minLength={3}
          className="bg-background/80"
        />
      </div>

      {selectedSong && (
        <div className="flex items-center gap-3 p-3 bg-muted/80 border-2 border-border rounded-md">
          <Image
            src={selectedSong.coverUrl}
            alt={selectedSong.title}
            width={40}
            height={40}
            className="rounded-none border-2 border-border"
          />
          <div className="text-sm">
            <p className="font-semibold">{selectedSong.title}</p>
            <p className="text-muted-foreground">{selectedSong.artist}</p>
          </div>
        </div>
      )}

      <div className="relative space-y-1">
        <label className="text-sm font-medium text-primary">Soundtrack</label>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a song..."
          required={!selectedSong}
          autoComplete="off"
          className="bg-background/80"
        />
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div className="absolute top-full mt-2 w-full bg-background border-2 border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto custom-scrollbar">
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
                    className="rounded-none"
                  />
                  <div className="text-sm w-full truncate">
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedSong && (
        <>
          <input
            type="hidden"
            name="song"
            value={`${selectedSong.title} - ${selectedSong.artist}`}
          />
          <input type="hidden" name="cover" value={selectedSong.coverUrl} />
          <input
            type="hidden"
            name="previewUrl"
            value={selectedSong.previewUrl || ""}
          />
        </>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
        <div className="text-xs text-muted-foreground flex items-center gap-2 self-start sm:self-center">
          <Avatar size={20} name={username} variant="beam" />
          Broadcasting as {username}
        </div>
        <Button
          type="submit"
          disabled={isPending || !selectedSong}
          className="w-full sm:w-auto font-heading shadow-pixel-sm !text-background bg-secondary hover:bg-secondary/80"
        >
          {isPending ? "SENDING..." : "LAUNCH MIXTAPE!"}
        </Button>
      </div>
    </form>
  );
}