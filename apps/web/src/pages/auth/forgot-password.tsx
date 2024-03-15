import { prisma } from "@maidanchyk/prisma";
import { GetServerSideProps } from "next";
import { ForgotPasswordForm } from "../../features/forgot-password-form";
import { StackedLayout } from "../../widgets/layout";
import { getSession } from "../../shared/lib/session";

export default function ForgotPassword() {
  return (
    <StackedLayout title="Forgot Password">
      <ForgotPasswordForm />
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
