import { cn } from "@maidanchyk/ui";
import Link from "next/link";

export function NavLink({
  className,
  href,
  children,
}: {
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={cn(
        "ring-offset-background focus-visible:ring-ring inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-orange-50/80 hover:text-orange-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      href={href}>
      {children}
    </Link>
  );
}
