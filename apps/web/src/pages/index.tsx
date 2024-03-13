import { GetServerSideProps } from "next";
import { prisma } from "@maidanchyk/prisma";
import { StackedLayout } from "../widgets/layout";
import { getSession } from "../shared/lib/session";

export default function Dashboard() {
  return <StackedLayout title="Dashboard">Dashboard</StackedLayout>;
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
