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
  cn,
} from "@maidanchyk/ui";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../shared/providers/auth";
import { getInitials } from "../../shared/lib/strings";

type Props = {
  className?: string;
};

export const UserMenu = ({ className }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative ml-3 flex max-w-xs items-center rounded-full bg-white text-sm hover:outline-none hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
            className,
          )}>
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <Avatar className="h-10 w-10">
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
              Налаштування
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/api/auth/sign-out">
            <LogOut className="mr-2 h-4 w-4" />
            Вийти
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
