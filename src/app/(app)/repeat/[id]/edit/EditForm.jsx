"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateRepeatAction } from "../../../action";
import { useActionState } from "react";
import { useEffect } from "react";

export function EditForm({ repeatData }) {
  const [state, action, pending] = useActionState(updateRepeatAction, null);
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const songTitle = repeatData.song
    ? repeatData.song.split(" - ")[0]
    : "No Title";
  const songArtist = repeatData.song
    ? repeatData.song.split(" - ")[1]
    : "No Artist";

  const handleSubmit = () => {
    toast.info("Update function not implemented yet.");
  };

  return (
    <form
      action={action}
      className="space-y-4 border p-6 rounded-lg bg-slate-50 dark:bg-slate-900"
    >
      <input type="hidden" name="id" value={repeatData._id} />
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-muted-foreground mb-1"
        >
          Your Message
        </label>
        <Textarea
          id="message"
          name="message"
          defaultValue={repeatData.message}
          required
          rows={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Song
        </label>
        <div className="p-3 bg-muted rounded-md text-sm">
          <p className="font-semibold">{songTitle}</p>
          <p>{songArtist}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Updating..." : "Update Repeat"}
        </Button>
      </div>
    </form>
  );
}
