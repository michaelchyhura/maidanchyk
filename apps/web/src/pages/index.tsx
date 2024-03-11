import { Button } from "@maidanchyk/ui";
import { trpc } from "../server/trpc";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  const { mutateAsync: logout } = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/sign-in");
  };

  return (
    <div>
      Dashboard
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
