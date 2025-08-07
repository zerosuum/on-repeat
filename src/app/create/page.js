import { RepeatForm } from "../(app)/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function CreatePage() {
  const cookieStore = cookies();
  const username = cookieStore.get("username")?.value;

  if (!username) {
    redirect("/login");
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading">New Broadcast</h1>
        <p className="text-muted-foreground">
          Send a new mixtape to your Player 2.
        </p>
      </div>
      <RepeatForm username={username} />
    </div>
  );
}
