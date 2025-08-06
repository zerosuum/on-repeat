"use client";

import { Button } from "@/components/ui/button";
import { deleteRepeatAction } from "./action";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteButton({ repeatId }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (window.confirm("Are you sure you want to delete this repeat?")) {
      startTransition(async () => {
        const result = await deleteRepeatAction(repeatId);
        if (result?.error) {
          toast.error(result.error);
        }
        if (result?.message) {
          toast.success(result.message);
        }
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive"
    >
      {isPending ? (
        <span className="animate-spin h-4 w-4 border-b-2 rounded-full"></span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
