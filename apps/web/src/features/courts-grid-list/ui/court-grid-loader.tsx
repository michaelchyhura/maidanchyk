import { AspectRatio, Skeleton, cn } from "@maidanchyk/ui";

interface Props {
  cols?: 3 | 4;
}

export function CourtGridLoader({ cols = 4 }: Props) {
  return (
    <ul
      className={cn(
        "grid gap-4",
        { "sm:grid-cols-2 lg:grid-cols-3": cols === 3 },
        { "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": cols === 4 },
      )}>
      {Array.from({ length: cols * 3 }).map((_, index) => (
        <li className="flex flex-col" key={index}>
          <AspectRatio className="mb-2 rounded-md" ratio={1}>
            <Skeleton className="h-full w-full" />
          </AspectRatio>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </li>
      ))}
    </ul>
  );
}
