import { ForgotPasswordForm } from "../../features/forgot-password-form";
import { StackedLayout } from "../../widgets/layout";
import { withUser } from "../../shared/lib/ssr";

export default function ForgotPassword() {
  return (
    <StackedLayout title="Забули пароль?" spacing>
      <p className="text-sm text-zinc-500">
        Введіть електронну пошту, пов'язану з вашим обліковим записом. Ми надішлемо вам посилання
        для відновлення пароля.
      </p>
      <ForgotPasswordForm />
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
