"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "./action";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full sm:max-w-sm p-6 sm:p-8 space-y-6 bg-background border-2 border-border rounded-lg shadow-pixel">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">on-repeat</h1>
          <p className="text-muted-foreground">Enter your callsign, Player 1</p>
        </div>

        <form action={action} className="space-y-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="username"
              className="font-heading text-lg text-primary"
            >
              {">"}
            </label>
            <Input
              id="username"
              name="username"
              required
              placeholder="YOUR NAME"
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/50"
              autoComplete="off"
            />
            <span className="w-2 h-5 bg-primary animate-blink"></span>
          </div>

          <Button
            type="submit"
            className="w-full font-heading text-lg !text-background bg-secondary hover:bg-secondary/80 rounded-md shadow-pixel-sm"
            disabled={pending}
          >
            {pending ? "CONNECTING..." : "START MISSION"}
          </Button>
        </form>

        {state?.error && (
          <p className="text-sm text-center text-destructive">{state.error}</p>
        )}
      </div>
    </div>
  );
}