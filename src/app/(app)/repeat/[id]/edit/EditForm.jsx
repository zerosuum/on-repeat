"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateRepeatAction } from "../../../action";
import useSound from "use-sound";
import { useFormState } from "react-dom";

export function EditForm({ repeatData }) {
  const [state, action, pending] = useFormState(updateRepeatAction, null);
  const [playClickSound] = useSound("/sounds/click.wav", { volume: 0.5 });

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

  return (
    <form
      action={action}
      className="space-y-6 border-2 bg-background/50 border-border p-6 rounded-lg shadow-pixel"
    >
      <input type="hidden" name="id" value={repeatData._id} />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-heading text-primary mb-2"
        >
          EDIT MESSAGE:
        </label>
        <Textarea
          id="message"
          name="message"
          defaultValue={repeatData.message}
          required
          rows={5}
          className="bg-background/80 rounded-none border-2 border-border focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-primary mb-2">
          LOCKED-IN TRACK:
        </label>
        <div className="p-3 bg-muted/80 border-2 border-border rounded-md text-sm">
          <p className="font-semibold">{songTitle}</p>
          <p className="text-muted-foreground">{songArtist}</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={playClickSound}
          type="submit"
          disabled={pending}
          className="font-heading shadow-pixel-sm !text-background bg-secondary hover:bg-secondary/80"
        >
          {pending ? "SAVING..." : "SAVE CHANGES"}
        </Button>
      </div>
    </form>
  );
}
