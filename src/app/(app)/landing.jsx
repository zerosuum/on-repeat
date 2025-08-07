"use client";

import { motion } from "framer-motion";
import useSound from "use-sound";

export function LandingPage({ onStart }) {
  const [playClickSound] = useSound("/sounds/click.wav", { volume: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px hsl(var(--primary))",
      boxShadow: "0px 0px 8px hsl(var(--primary))",
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const handleStartClick = () => {
    playClickSound();
    onStart();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background space-y-8 text-center px-4"
    >
      <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl">
        On-Repeat
      </motion.h1>

      <motion.p variants={itemVariants} className="text-lg max-w-md">
        Craft a pixel-perfect message, pair it with a legendary track, and send
        it to your Player 2.
      </motion.p>

      <motion.button
        variants={itemVariants}
        whileHover="hover"
        onClick={handleStartClick}
        className="font-heading text-lg sm:text-2xl bg-primary text-primary-foreground py-2 px-4 sm:py-3 sm:px-8 rounded-md shadow-pixel"
      >
        [ PRESS START ]
      </motion.button>
    </motion.div>
  );
}
