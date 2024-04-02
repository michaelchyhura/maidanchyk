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
import { FolderPlus, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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

      toast({ title: "Майданчик успішно видалено" });
    } catch {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  return (
    <StackedLayout title="Мої Оголошення" spacing>
      {courts ? (
        courts.items.length ? (
          <>
            <div className="flex justify-end">
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/courts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Створити нове оголошення
                </Link>
              </Button>
            </div>

            <div className="space-y-20">
              <div>
                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                  <caption className="sr-only">Майданчик</caption>
                  <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                    <tr>
                      <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                        Назва
                      </th>
                      <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                        Ціна
                      </th>
                      <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                        Дата Публікації
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
                                <DropdownMenuLabel>Опції</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/courts/edit/${court.id}`)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Редагувати
                                </DropdownMenuItem>

                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Trash2 className="mr-2 h-4 w-4" /> Видалити
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ви абсолютно впевнені?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Цю дію неможливо скасувати. Вона остаточно видалить дані про
                                  майданчик з наших серверів
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Відмінити</AlertDialogCancel>
                                <AlertDialogAction
                                  variant="destructive"
                                  onClick={() => handleDeleteCourt(court.id)}>
                                  Видалити
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
              <Pagination className="py-12">
                <PaginationContent>
                  {page !== 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={{ pathname: "/courts/mine", query: { page: page - 1 } }}
                      />
                    </PaginationItem>
                  )}

                  {Array.from({ length: courts.totalPages })
                    .slice(0, 2)
                    .map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={page === index + 1}
                          href={{ pathname: "/courts/mine", query: { page: index + 1 } }}>
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
                      <PaginationLink isActive href={{ pathname: "/courts/mine", query: { page } }}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {courts.totalPages > 4 && (
                    <PaginationItem>
                      <PaginationLink
                        isActive={page === courts.totalPages}
                        href={{
                          pathname: "/courts/mine",
                          query: { page: courts.totalPages },
                        }}>
                        {courts.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page !== courts.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={{ pathname: "/courts/mine", query: { page: page + 1 } }}
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
        <h3 className="text-sm font-semibold text-zinc-900">Ще немає майданчиків</h3>
        <p className="text-sm text-zinc-500">Розпочніть, створивши нове оголошення</p>
      </div>

      <Button size="sm" asChild>
        <Link href="/courts/create">
          <Plus className="mr-2 h-4 w-4" />
          Створити нове оголошення
        </Link>
      </Button>
    </div>
  );
};