import Link from "next/link";
import { Button } from "./button";
import { Send } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter">on-repeat</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/create" passHref>
              <>
                <Button className="hidden sm:flex font-heading shadow-pixel-sm !text-background bg-secondary hover:bg-secondary/80">
                  <Send className="w-4 h-4 mr-2" />
                  Broadcast Mixtape
                </Button>

                <Button
                  size="icon"
                  className="sm:hidden font-heading shadow-pixel-sm !text-background bg-secondary hover:bg-secondary/80"
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Broadcast Mixtape</span>
                </Button>
              </>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
