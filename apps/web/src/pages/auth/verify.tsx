import { GetServerSideProps } from "next";
import { prisma } from "@maidanchyk/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@maidanchyk/ui";
import { getSession } from "../../shared/lib/session";
import { StackedLayout } from "../../widgets/layout";
import { VerifyEmailForm } from "../../features/verify-email-form";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);

  if (!session.userId) {
    return { props: {} };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      phone: true,
      telegram: true,
      role: true,
    },
  });

  return {
    props: {
      user,
    },
  };
};
