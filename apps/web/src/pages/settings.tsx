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
        title: "Reset link successfully sent",
        description: "Please check your email inbox and follow the instructions",
      });
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  return (
    <StackedLayout title="Settings" spacing>
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            Using your profile photo, other people will be able to recognize you, and it will be
            easier for you to determine which account you are logged into
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAvatarForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Personal info and options to manage it</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Request reset password link to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResetPassword} disabled={isLoading}>
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </StackedLayout>
  );
}

export const getServerSideProps = withUser();
