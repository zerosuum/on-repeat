import { CassetteCard } from "./CasseteCard";
import { NameSearch } from "./NameSearch";
import { cookies } from "next/headers";

async function getRepeats(searchQuery) {
  const apiUrl = "https://v1.appbackend.io/v1/rows/aj3vz68G55TG";

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) return [];

    let { data } = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    if (searchQuery) {
      data = data.filter(
        (repeat) => repeat.to?.toLowerCase() === searchQuery.toLowerCase()
      );
    }

    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Failed to fetch repeats:", error);
    return [];
  }
}

export default async function HomePage({ searchParams }) {
  const toQuery = searchParams.to || "";
  const repeats = await getRepeats(toQuery);
  const loggedInUsername = cookies().get("username")?.value;

  return (
    <div className="container py-8">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-heading">Find Your Mixtape</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Someone might have sent a mixtape just for you. Search your callsign
          to see the mission log.
        </p>
      </div>

      <NameSearch initialQuery={toQuery} />

      <div className="mt-12">
        <h2 className="text-xl font-semibold border-b-2 border-border pb-2 mb-4">
          {toQuery ? `Mission Log for "${toQuery}"` : "Recent Broadcasts"}
        </h2>

        {repeats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repeats.map((repeat) => (
              <CassetteCard
                key={repeat._id}
                repeat={repeat}
                username={loggedInUsername}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <p>No mixtapes found.</p>
            {toQuery ? (
              <p>Try searching for a different name.</p>
            ) : (
              <p>Be the first to broadcast one!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
