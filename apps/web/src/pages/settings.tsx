import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
} from "@maidanchyk/ui";
import { StackedLayout } from "../widgets/layout";
import { UserForm } from "../features/user-form";
import { UserAvatarForm } from "../features/user-avatar-form";
import { useAuth } from "../shared/providers/auth";
import { trpc } from "../server/trpc";
import { withUser } from "../shared/lib/ssr";

export default function Settings() {
  const { toast } = useToast();

  const { user } = useAuth();

  const { mutateAsync: sendResetPasswordEmail, isLoading } = trpc.auth.forgotPassword.useMutation();

  const handleResetPassword = async () => {
    try {
      await sendResetPasswordEmail({ email: user?.email || "" });

      toast({
        title: "Посилання на скидання паролю успішно відправлено",
        description: "Будь ласка, перевірте вашу пошту",
      });
    } catch (error) {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  return (
    <StackedLayout title="Налаштування" spacing>
      <Card>
        <CardHeader>
          <CardTitle>Фото</CardTitle>
          <CardDescription>
            Використовуючи ваше фото профілю, інші люди зможуть вас впізнати, і вам буде легше
            визначити, в який обліковий запис ви увійшли
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAvatarForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Мій профіль</CardTitle>
          <CardDescription>Особиста інформація та опції для її управління</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Пароль</CardTitle>
          <CardDescription>
            Відправити посилання на скидання пароля на вашу електронну пошту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResetPassword} disabled={isLoading}>
            Скинути пароль
          </Button>
        </CardContent>
      </Card>
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
