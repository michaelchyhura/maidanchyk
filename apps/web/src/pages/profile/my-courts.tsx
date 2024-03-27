import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
  useToast,
} from "@maidanchyk/ui";
import Image from "next/image";
import { FolderPlus, MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Link from "next/link";
import { trpc } from "../../server/trpc";
import { withUser } from "../../shared/lib/ssr";
import { useAuth } from "../../shared/providers/auth";
import { StackedLayout } from "../../widgets/layout";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../../shared/ui/pagination";

export default function MyCourts() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const page = parseInt(searchParams.get("page")?.toString() || "1", 10);

  const { data: courts, refetch } = trpc.courts.list.useQuery({
    page,
    limit: 15,
    userId: user?.id,
  });
  const { mutateAsync: deleteCourt } = trpc.courts.delete.useMutation();

  const handleDeleteCourt = async (id: string) => {
    try {
      await deleteCourt({ id });
      await refetch();

      toast({ title: "Court deleted successfully" });
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <StackedLayout title="My Courts" spacing>
      <p className="text-sm text-zinc-500">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium placeat ducimus, ipsa
        odit quaerat sequi officiis itaque sit iusto excepturi ratione, deserunt, neque officia
        distinctio doloribus. Ipsam exercitationem vitae nam.
      </p>

      {courts ? (
        courts.items.length ? (
          <>
            <div className="flex justify-end">
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/courts/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Court
                </Link>
              </Button>
            </div>

            <div className="space-y-20">
              <div>
                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                  <caption className="sr-only">Court</caption>
                  <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                    <tr>
                      <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                        Court
                      </th>
                      <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                        Price
                      </th>
                      <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                        Published at
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                    {courts.items.map((court) => (
                      <tr key={court.id}>
                        <td className="py-6 pr-8">
                          <div className="flex items-center">
                            <Image
                              src={court.photos[0].url}
                              alt={`${court.name}'s thumbnail`}
                              className="mr-6 h-16 w-16 rounded-md object-cover object-center"
                              height={64}
                              width={64}
                            />
                            <div>
                              <Link href={`/courts/${court.id}`}>
                                <div className="font-medium text-gray-900">{court.name}</div>
                              </Link>
                              <div className="mt-1 sm:hidden">{court.price}₴</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">{court.price}₴</td>
                        <td className="hidden py-6 pr-8 sm:table-cell">
                          {dayjs(court.createdAt).format("ll")}
                        </td>
                        <td className="whitespace-nowrap py-6 text-right font-medium">
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/courts/edit/${court.id}`)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>

                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your
                                  account and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  variant="destructive"
                                  onClick={() => handleDeleteCourt(court.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {!!courts?.totalPages && (
              <Pagination>
                <PaginationContent>
                  {page !== 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={{ pathname: "/profile/my-courts", query: { page: page - 1 } }}
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: courts.totalPages })
                    .slice(0, 2)
                    .map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={page === index + 1}
                          href={{ pathname: "/profile/my-courts", query: { page: index + 1 } }}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {[1, 2, courts.totalPages].includes(page) ? (
                    courts.totalPages > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  ) : (
                    <PaginationItem>
                      <PaginationLink
                        isActive
                        href={{ pathname: "/profile/my-courts", query: { page } }}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {courts.totalPages > 4 && (
                    <PaginationItem>
                      <PaginationLink
                        isActive={page === courts.totalPages}
                        href={{
                          pathname: "/profile/my-courts",
                          query: { page: courts.totalPages },
                        }}>
                        {courts.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page !== courts.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={{ pathname: "/profile/my-courts", query: { page: page + 1 } }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState />
        )
      ) : (
        <Loader />
      )}
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();

const Loader = () => {
  return (
    <div className="space-y-20">
      <div>
        <table className="mt-4 w-full text-gray-500 sm:mt-6">
          <caption className="sr-only">Court</caption>
          <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
            <tr>
              <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                Court
              </th>
              <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                Price
              </th>
              <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                Published at
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="py-6 pr-8">
                  <div className="flex items-center">
                    <Skeleton className="mr-6 h-16 w-16 rounded-md" />
                    <div>
                      <Skeleton className="h-5 w-[220px] rounded-md" />
                      <Skeleton className="mt-1 h-5 w-[100px] rounded-md sm:hidden" />
                    </div>
                  </div>
                </td>
                <td className="hidden py-6 pr-8 sm:table-cell">
                  <Skeleton className="h-5 w-[100px] rounded-md" />
                </td>
                <td className="hidden py-6 pr-8 sm:table-cell">
                  <Skeleton className="h-5 w-[150px] rounded-md" />
                </td>
                <td className="whitespace-nowrap py-6 text-right font-medium">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="space-y-4 rounded-md border border-dashed border-zinc-200 p-12 text-center">
      <FolderPlus className="mx-auto h-12 w-12 text-zinc-400" />
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">No courts yet</h3>
        <p className="text-sm text-zinc-500">Get started by creating a new court</p>
      </div>

      <Button size="sm" asChild>
        <Link href="/courts/create">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Court
        </Link>
      </Button>
    </div>
  );
};
