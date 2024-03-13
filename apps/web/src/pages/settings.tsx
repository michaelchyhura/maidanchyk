import { GetServerSideProps } from "next";
import { StackedLayout } from "../widgets/layout";
import { getSession } from "../shared/lib/session";
import { prisma } from "@maidanchyk/prisma";
import { UserForm, userSchema } from "../features/user-form";
import { trpc } from "../server/trpc";
import { z } from "zod";
import { useToast } from "@maidanchyk/ui";

export default function Settings() {
  const { toast } = useToast();

  const { mutateAsync: updateUser } = trpc.user.update.useMutation();

  const handleUpdateUser = async (values: z.infer<typeof userSchema>) => {
    try {
      await updateUser({
        name: values.name || null,
        phone: values.phone || null,
        telegram: values.telegram || null
      });

      toast({ title: "Profile successfully updated" });
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  return (
    <StackedLayout title="Settings">
      <UserForm onSubmit={handleUpdateUser} />
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
