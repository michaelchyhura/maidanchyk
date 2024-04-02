import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@maidanchyk/ui";
import { StackedLayout } from "../../widgets/layout";
import { VerifyEmailForm } from "../../features/verify-email-form";
import { withUser } from "../../shared/lib/ssr";

export default function Verify() {
  return (
    <StackedLayout title="Підтвердження електронної пошти">
      <Card>
        <CardHeader>
          <CardTitle>Дякуємо за реєстрацію!</CardTitle>
          <CardDescription>
            Для завершення процесу реєстрації, будь ласка, введіть код підтвердження, який був
            надісланий на вашу електронну пошту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
        </CardContent>
      </Card>
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
