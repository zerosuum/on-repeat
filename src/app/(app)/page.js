import { Card, CardContent } from "@/components/ui/card";
import { RepeatForm } from "./form";
import Avatar from "boring-avatars";
import Image from "next/image";
import moment from "moment";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteButton } from "./DeleteButton";
import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getRepeats() {
  const api_url = "https://v1.appbackend.io/v1/rows/aj3vz68G55TG";
  try {
    const res = await fetch(api_url, { cache: "no-store" });
    if (!res.ok) return [];
    const { data: repeats } = await res.json();
    if (!Array.isArray(repeats)) return [];
    return repeats.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Failed to fetch repeats:", error);
    return [];
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const usernameCookie = cookieStore.get("username");

  if (!usernameCookie) {
    redirect("/login");
  }

  const username = usernameCookie.value;
  const repeats = await getRepeats();

  return (
    <div className="space-y-8">
      <RepeatForm username={username} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">
          Recent Repeats
        </h2>
        <div className="space-y-4">
          {repeats.map((repeat) => (
            <Card key={repeat._id}>
              <CardContent className="pt-6">
                <p className="mb-4 text-lg text-card-foreground">
                  {repeat.message}
                </p>
                <div className="flex items-center gap-4 border-t pt-4">
                  <Image
                    src={repeat.cover || "https://i.imgur.com/3Y1q4k5.png"}
                    alt={repeat.song || "Song cover"}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-md object-cover shadow-md"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-base">
                      {repeat.song ? repeat.song.split(" - ")[0] : "No Title"}
                    </p>
                    <p className="text-muted-foreground">
                      {repeat.song ? repeat.song.split(" - ")[1] : "No Artist"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="border-t bg-muted/50 px-6 py-3 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar size={20} name={repeat.author} variant="pixel" />
                  Shared by {repeat.author}
                </div>
                <div className="flex items-center gap-1">
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
