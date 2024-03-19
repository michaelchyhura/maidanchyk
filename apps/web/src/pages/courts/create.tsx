import { CourtForm } from "../../features/court-form";
import { withUser } from "../../shared/lib/ssr";
import { StackedLayout } from "../../widgets/layout";

export default function CreateCourt() {
  return (
    <StackedLayout title="Create New Court Advertisement" spacing>
       <p className="text-sm text-zinc-500">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium placeat ducimus, ipsa
        odit quaerat sequi officiis itaque sit iusto excepturi ratione, deserunt, neque officia
        distinctio doloribus. Ipsam exercitationem vitae nam.
      </p>
      <CourtForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
