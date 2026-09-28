import { Dashboard } from "@/components/Dashboard";
import { getSession } from "@/lib/session";

export default async function Home() {
  const { email, isPaid } = await getSession();
  return <Dashboard email={email} isPaid={isPaid} />;
}
