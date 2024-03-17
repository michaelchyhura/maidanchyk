import { CourtForm } from "../../features/court-form";
import { withUser } from "../../shared/lib/ssr";
import { StackedLayout } from "../../widgets/layout";

export default function CreateCourt() {
  return (
    <StackedLayout title="Create New Court Advertisement" spacing>
      <CourtForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
