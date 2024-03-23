import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@maidanchyk/ui";
import { Settings, LogOut } from "lucide-react";
import { trpc } from "../../server/trpc";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/providers/auth";
import { getInitials } from "../../shared/lib/strings";

export const UserMenu = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { mutateAsync: signOut } = trpc.auth.signOut.useMutation();

  const handleSignOut = async () => {
    await signOut();

    router.push("/auth/sign-in");
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative ml-3 flex max-w-xs items-center rounded-full bg-white text-sm hover:outline-none hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photo || undefined} alt="" />
            <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuLabel>
          {user.name && <p className="font-medium text-gray-800">{user.name}</p>}
          <p className="break-all text-sm font-medium text-gray-500">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
