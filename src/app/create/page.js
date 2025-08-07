import { RepeatForm } from "../(app)/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function CreatePage() {
  const cookieStore = cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    redirect("/login?callbackUrl=/create");
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading">New Broadcast</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Send a new mixtape to your Player 2.
        </p>
      </div>
      <div className="mb-8">
        <RepeatForm username={username} />
      </div>
      <div className="text-center text-muted-foreground text-sm">
        Broadcasting as{" "}
        <span className="font-semibold text-primary">{username}</span>
      </div>
    </div>
  );
}
