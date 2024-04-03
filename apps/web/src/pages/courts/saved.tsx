import { useSearchParams } from "next/navigation";
import { trpc } from "../../server/trpc";
import { withUser } from "../../shared/lib/ssr";
import { StackedLayout } from "../../widgets/layout";
import { CourtGridPagination, CourtsGridList } from "../../features/courts-grid-list";
import { useCustomEventSubscription } from "../../shared/hooks";

export default function Courts() {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page")?.toString() || "1", 10);

  const { data, isLoading, refetch } = trpc.courts.list.useQuery({
    page,
    limit: 15,
    saved: true,
  });

  const courts = data?.items || [];

  useCustomEventSubscription("courts:saved/unsaved", async () => {
    await refetch();
  });

  return (
    <StackedLayout badge={data?.total} title="Збережені">
      <CourtsGridList courts={courts} loading={isLoading}>
        <CourtGridPagination page={page} pathname="/courts/saved" totalPages={data?.totalPages} />
      </CourtsGridList>
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
