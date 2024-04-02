import { CourtForm } from "../../features/court-form";
import { withUser } from "../../shared/lib/ssr";
import { StackedLayout } from "../../widgets/layout";

export default function CreateCourt() {
  return (
    <StackedLayout spacing title="Новий майданчик">
      <CourtForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
