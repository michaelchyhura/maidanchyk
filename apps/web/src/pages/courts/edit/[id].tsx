import { useRouter } from "next/router";
import { Skeleton } from "@maidanchyk/ui";
import { CourtForm } from "../../../features/court-form";
import { trpc } from "../../../server/trpc";
import { withUser } from "../../../shared/lib/ssr";
import { useAuth } from "../../../shared/providers/auth";
import { StackedLayout } from "../../../widgets/layout";

export default function EditCourt() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: court } = trpc.courts.get.useQuery({
    id: router.query.id as string,
    userId: user?.id,
  });

  return (
    <StackedLayout title="Редагувати Майданчик" spacing>
      {court ? (
        <CourtForm court={court} />
      ) : (
        <>
          <Skeleton className="h-[472px] w-full rounded-md" />
          <Skeleton className="h-[290px] w-full rounded-md" />
          <Skeleton className="h-[316px] w-full rounded-md" />
          <Skeleton className="h-[676px] w-full rounded-md" />
          <Skeleton className="h-[346px] w-full rounded-md" />
        </>
      )}
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
