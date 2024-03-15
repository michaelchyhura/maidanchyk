import { StackedLayout } from "../../widgets/layout";
import { ResetPasswordForm } from "../../features/reset-password-form";
import { withUser } from "../../shared/lib/ssr";

export default function ResetPassword() {
  return (
    <StackedLayout title="Reset Password">
      <ResetPasswordForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
