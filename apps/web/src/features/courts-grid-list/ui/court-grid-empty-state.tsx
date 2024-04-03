import { SearchX } from "lucide-react";

export function CourtGridEmptyState() {
  return (
    <div className="space-y-4 rounded-md border border-dashed border-zinc-200 p-12 text-center">
      <SearchX className="mx-auto h-12 w-12 text-zinc-400" />
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Немає майданчиків за обраними фільтрами
        </h3>
        {/* <p className="text-sm text-zinc-500">
            Unfortunately, no courts matched your search criteria
          </p> */}
      </div>
    </div>
  );
}
