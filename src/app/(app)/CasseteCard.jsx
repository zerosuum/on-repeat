"use client";

import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import Avatar from "boring-avatars";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "./DeleteButton";
import { FilePenLine, Play, Pause, Music, Gift } from "lucide-react";
import { useState, useEffect } from "react";

export function CassetteCard({ repeat, isPlaying, onPlay, username }) {
  const [playClickSound] = useSound("/sounds/click.wav", { volume: 0.5 });

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const cookieUsername = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];

    const currentUsername = username || cookieUsername;

    if (repeat.author?.toLowerCase() === currentUsername?.toLowerCase()) {
      setIsOwner(true);
    }
  }, [repeat.author, username]);

  const handlePlayClick = () => {
    if (onPlay) {
      playClickSound();
      onPlay();
    }
  };

  return (
    <div className="bg-muted/40 border-2 border-border rounded-lg shadow-pixel font-sans text-white relative p-2 space-y-2">
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-border"></div>
      <div className="w-full h-5 flex justify-center">
        <div className="w-[60%] h-full bg-muted/80 border-x-2 border-b-2 border-border rounded-b-md"></div>
      </div>

      <div className="bg-background border-2 border-border p-2 sm:p-4">
        <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground px-1">
          {repeat.to && (
            <div className="flex items-center gap-2 text-primary">
              <Gift size={14} className="flex-shrink-0" />
              <p className="font-semibold truncate">For: {repeat.to}</p>
            </div>
          )}
          <div className="flex items-center gap-2 justify-end flex-grow">
            <p className="truncate text-right">From: {repeat.author}</p>
            <Avatar size={20} name={repeat.author} variant="bauhaus" />
          </div>
        </div>

        <div className="bg-black/20 p-4 border border-muted-foreground/30 relative">
          <p className="text-base sm:text-lg mb-4 h-24 overflow-y-auto custom-scrollbar">
            {repeat.message}
          </p>
          <div className="absolute bottom-2 left-4 w-6 h-6 border-2 border-muted-foreground/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          </div>
          <div className="absolute bottom-2 right-4 w-6 h-6 border-2 border-muted-foreground/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 border-t-2 border-dashed border-border pt-4 mt-4">
          <div className="relative h-14 w-14 flex-shrink-0 self-center sm:self-auto">
            <Image
              src={repeat.cover || "https://i.imgur.com/3Y1q4k5.png"}
              alt={repeat.song || "Song cover"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-none border-2 border-border object-cover"
            />
            {repeat.previewUrl && onPlay && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            )}
          </div>
          <div className="text-sm truncate w-full">
            <p className="font-semibold text-base truncate flex items-center gap-2">
              <Music size={14} />{" "}
              {repeat.song ? repeat.song.split(" - ")[0] : "No Title"}
            </p>
            <p className="text-muted-foreground truncate">
              {repeat.song ? repeat.song.split(" - ")[1] : "No Artist"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>{moment(repeat.createdAt).format("DD MMM YYYY")}</span>

        {isOwner && (
          <div className="flex items-center">
            <Link href={`/repeat/${repeat._id}/edit`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <FilePenLine className="w-4 h-4" />
              </Button>
            </Link>
            <DeleteButton repeatId={repeat._id} />
          </div>
        )}
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-border"></div>
    </div>
  );
}
