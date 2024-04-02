import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@maidanchyk/ui";
// import { useDebouncedCallback } from "use-debounce";
import type { CourtEvent } from "@maidanchyk/prisma";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { trpc } from "../../server/trpc";
import { withUser } from "../../shared/lib/ssr";
import { StackedLayout } from "../../widgets/layout";
import { IVANO_FRANKIVSK_CITY } from "../../shared/constants/google-places";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../shared/ui";
import { CourtsFilters } from "../../features/courts-filters";
import { CourtsGridList } from "../../features/courts-grid-list";
import { presence } from "../../shared/lib/objects";

export default function Courts() {
  const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  const page = parseInt(searchParams.get("page")?.toString() || "1", 10);
  const query = searchParams.get("query")?.toString();
  const sort = searchParams.get("sort")?.toString() || "recent";
  const events = searchParams.get("events")?.toString().split(",");

  const { data, isLoading } = trpc.courts.list.useQuery({
    page,
    limit: 15,
    // query,
    sort: (
      {
        recent: { createdAt: "desc" },
        cheapest: { price: "asc" },
        expensive: { price: "desc" },
      } as const
    )[sort || "recent"],
    city: { placeId: IVANO_FRANKIVSK_CITY.place_id },
    events: events as CourtEvent[],
  });

  const courts = data?.items || [];

  // const handleQueryChange = useDebouncedCallback((query: string) => {
  //   const params = new URLSearchParams(searchParams);

  //   if (query) {
  //     params.set("query", query);
  //   } else {
  //     params.delete("query");
  //   }

  //   params.set("page", "1");

  //   replace([pathname, params.toString()].filter(Boolean).join("?"));
  // }, 300);

  return (
    <StackedLayout badge={data?.total} spacing title="Майданчики">
      <div className="flex flex-col gap-x-4 sm:flex-row">
        <div className="hidden w-1/4 sm:block sm:space-y-4">
          <CourtsFilters />
        </div>

        <div className="space-y-4 sm:w-3/4 sm:space-y-0">
          <div className="flex gap-x-4">
            <Drawer>
              <DrawerTrigger asChild className="sm:hidden">
                <Button className="w-full">
                  <Filter className="mr-2" /> Фільтри
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Фільтри</DrawerTitle>
                  <div className="space-y-4 text-left">
                    <CourtsFilters />
                  </div>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button className="w-full">Застосувати</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* <Input
              defaultValue={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search..."
            /> */}
          </div>

          <CourtsGridList courts={courts} loading={isLoading}>
            {!!data?.totalPages && (
              <Pagination className="py-12">
                <PaginationContent>
                  {page !== 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={{
                          pathname: "/courts",
                          query: presence({ page: page - 1, query, sort, events }),
                        }}
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: data.totalPages })
                    .slice(0, 2)
                    .map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href={{
                            pathname: "/courts",
                            query: presence({ page: index + 1, query, sort, events }),
                          }}
                          isActive={page === index + 1}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {[1, 2, data.totalPages].includes(page) && data.totalPages > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {![1, 2].includes(page) && page !== data.totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href={{
                          pathname: "/courts",
                          query: presence({ page, query, sort, events }),
                        }}
                        isActive>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {data.totalPages > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href={{
                          pathname: "/courts",
                          query: presence({ page: data.totalPages, query, sort, events }),
                        }}
                        isActive={page === data.totalPages}>
                        {data.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page !== data.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={{
                          pathname: "/courts",
                          query: presence({ page: page + 1, query, sort, events }),
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </CourtsGridList>
        </div>
      </div>
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
