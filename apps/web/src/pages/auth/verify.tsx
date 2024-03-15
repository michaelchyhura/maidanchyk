import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@maidanchyk/ui";
import { StackedLayout } from "../../widgets/layout";
import { VerifyEmailForm } from "../../features/verify-email-form";
import { withUser } from "../../shared/lib/ssr";

export default function Verify() {
  return (
    <StackedLayout title="Verify your email">
      <Card>
        <CardHeader>
          <CardTitle>Please enter the verification code sent to your email</CardTitle>
          <CardDescription>
            We have sent a verification code to your email. Please enter it below to complete your
            sign up process
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
