"use client";

import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import Avatar from "boring-avatars";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "./DeleteButton";
import { FilePenLine, Play, Pause, Music } from "lucide-react";

export function CassetteCard({ repeat, isPlaying, onPlay, username }) {
  const [playClickSound] = useSound("/sounds/click.wav", { volume: 0.5 });

  const handlePlayClick = () => {
    playClickSound();
    onPlay();
  };

  return (
    <div className="bg-muted/40 border-2 border-border rounded-lg shadow-pixel font-sans text-white relative p-2 space-y-2">
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-border"></div>
      <div className="w-full h-5 flex justify-center">
        <div className="w-[60%] h-full bg-muted/80 border-x-2 border-b-2 border-border rounded-b-md"></div>
      </div>
      <div className="bg-background border-2 border-border p-2 sm:p-4">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t-2 border-dashed border-border pt-4 mt-4">
          <div className="relative self-center sm:self-auto">
            <Image
              src={repeat.cover || "https://i.imgur.com/3Y1q4k5.png"}
              alt={repeat.song || "Song cover"}
              width={56}
              height={56}
              className="w-14 h-14 rounded-none border-2 border-border"
            />
            {repeat.previewUrl && (
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
        <div className="flex items-center gap-2">
          <Avatar size={20} name={repeat.author} variant="pixel" />
          <p className="truncate">Shared by {repeat.author}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span>{moment(repeat.createdAt).format("DD MMM YYYY")}</span>
          {repeat.author?.toLowerCase() === username?.toLowerCase() && (
            <>
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
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-border"></div>
    </div>
  );
}
