import { GetServerSideProps } from "next";
import { StackedLayout } from "../widgets/layout";
import { getSession } from "../shared/lib/session";
import { prisma } from "@maidanchyk/prisma";
import { UserForm } from "../features/user-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@maidanchyk/ui";
import { UserAvatarForm } from "../features/user-avatar-form";

export default function Settings() {
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
