import { StackedLayout } from "../widgets/layout";
import { withUser } from "../shared/lib/ssr";

export default function Dashboard() {
  return <StackedLayout title="Dashboard">Welcome to Maidanchyk!</StackedLayout>;
}

export const getServerSideProps = withUser();
