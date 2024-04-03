import { presence } from "../../shared/lib/objects";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../shared/ui";

interface Props {
  page: number;
  totalPages?: number;
  pathname: string;
  query?: Record<string, any>;
}

export function CourtGridPagination({ page, totalPages = 0, pathname, query = {} }: Props) {
  if (totalPages === 0) {
    return null;
  }

  return (
    <Pagination className="py-12">
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={{ pathname, query: presence({ ...query, page: page - 1 }) }}
            />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages })
          .slice(0, 2)
          .map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={{ pathname, query: presence({ ...query, page: index + 1 }) }}
                isActive={page === index + 1}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

        {[1, 2, totalPages].includes(page) && totalPages > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {![1, 2].includes(page) && page !== totalPages && (
          <PaginationItem>
            <PaginationLink href={{ pathname, query: presence({ ...query, page }) }} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
        )}

        {totalPages > 2 && (
          <PaginationItem>
            <PaginationLink
              href={{ pathname, query: presence({ ...query, page: totalPages }) }}
              isActive={page === totalPages}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {page !== totalPages && (
          <PaginationItem>
            <PaginationNext href={{ pathname, query: presence({ ...query, page: page + 1 }) }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
