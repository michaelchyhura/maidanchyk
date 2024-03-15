import { ForgotPasswordForm } from "../../features/forgot-password-form";
import { StackedLayout } from "../../widgets/layout";
import { withUser } from "../../shared/lib/ssr";

export default function ForgotPassword() {
  return (
    <StackedLayout title="Forgot Password">
      <ForgotPasswordForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
