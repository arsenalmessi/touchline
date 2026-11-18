
import { getAdminMessages } from "@/actions/inbox";
import AdminMessagesClient from "@/components/Dashboard/Admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const result = await getAdminMessages();

  if (result.status !== 200) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">
          Unable to load messages
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {result.error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050403] p-3 text-[#f0ebe0] sm:p-5 lg:p-8">
      <AdminMessagesClient messages={result.data} />
    </main>
  );
}
