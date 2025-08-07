"use client";

import { useState, useEffect, useRef } from "react";
import { RepeatForm } from "./form";
import { LandingPage } from "./landing";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CassetteCard } from "./CasseteCard";

const listVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  hidden: { opacity: 0, y: 20 },
};

export default function HomePage() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState("Player1");
  const [repeats, setRepeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [nowPlaying, setNowPlaying] = useState(null);
  const audioRef = useRef(null);

  const handlePlay = (repeat) => {
    if (!repeat.previewUrl) return;
    if (nowPlaying === repeat._id) {
      audioRef.current.pause();
      setNowPlaying(null);
    } else {
      audioRef.current.src = repeat.previewUrl;
      audioRef.current.play();
      setNowPlaying(repeat._id);
    }
  };

  const handleStart = () => {
    sessionStorage.setItem("hasSeenLanding", "true");
    setShowLanding(false);
  };

  async function getRepeats() {
    const api_url = "https://v1.appbackend.io/v1/rows/aj3vz68G55TG";
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(api_url, { cache: "no-store" });
      if (!res.ok) return [];
      const { data } = await res.json();
      return Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
    } catch (error) {
      console.error("Failed to fetch repeats:", error);
      return [];
    }
  }

  useEffect(() => {
    setIsClient(true);
    const hasSeen = sessionStorage.getItem("hasSeenLanding");
    if (hasSeen) {
      setShowLanding(false);
    }

    const audioEl = audioRef.current;
    const onEnded = () => setNowPlaying(null);
    if (audioEl) {
      audioEl.addEventListener("ended", onEnded);
    }

    return () => {
      if (audioEl) {
        audioEl.removeEventListener("ended", onEnded);
      }
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!showLanding) {
      const userFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("username="))
        ?.split("=")[1];
      if (!userFromCookie) {
        window.location.href = "/login";
        return;
      }
      setUsername(userFromCookie);
      setLoading(true);
      getRepeats().then((data) => {
        setRepeats(data);
        setLoading(false);
      });
    }
  }, [showLanding, isClient]);

  if (!isClient || showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 py-8 px-4">
        {/* Kolom Kiri Skeleton */}
        <aside className="md:w-1/3 lg:w-2/5">
          <div className="sticky top-8">
            <div className="space-y-4 border-2 bg-background/50 border-border p-4 sm:p-6 rounded-lg shadow-pixel">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </aside>
        {/* Kolom Kanan Skeleton */}
        <main className="md:w-2/3 lg:w-3/5">
          <h2 className="text-xl font-semibold border-b-2 border-border pb-2 mb-4">
            Mission Log
          </h2>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="border-2 border-border shadow-pixel p-4 space-y-4 rounded-lg"
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-4 border-t-2 pt-4">
                  <Skeleton className="h-14 w-14" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <audio ref={audioRef} />
      <div className="flex flex-col md:flex-row gap-8 py-8 px-4">
        {/* Kolom Kiri - Panel Aksi (Form) */}
        <aside className="md:w-1/3 lg:w-2/5">
          <div className="sticky top-8">
            <RepeatForm username={username} />
          </div>
        </aside>

        {/* Kolom Kanan - Feed Konten (Mission Log) */}
        <main className="md:w-2/3 lg:w-3/5 min-h-screen">
          <h2 className="text-xl font-semibold border-b-2 border-border pb-2 mb-4">
            Mission Log
          </h2>
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={listVariants}
          >
            {repeats.length > 0 ? (
              repeats.map((repeat) => (
                <motion.div key={repeat._id} variants={itemVariants}>
                  <CassetteCard
                    repeat={repeat}
                    isPlaying={nowPlaying === repeat._id}
                    onPlay={() => handlePlay(repeat)}
                    username={username}
                  />
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <p>Mission log is empty.</p>
                <p>Be the first to broadcast a mixtape!</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
