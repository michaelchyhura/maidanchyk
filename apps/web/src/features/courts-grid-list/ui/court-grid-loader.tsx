import { AspectRatio, Skeleton } from "@maidanchyk/ui";

export function CourtGridLoader() {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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