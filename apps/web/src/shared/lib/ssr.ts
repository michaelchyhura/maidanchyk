import type { GetServerSideProps } from "next";
import { prisma } from "@maidanchyk/prisma";
import { getSession } from "./session";

export const withUser: (getServerSideProps?: GetServerSideProps) => GetServerSideProps = (
  getServerSideProps,
) => {
  return async (ctx) => {
    const session = await getSession(ctx.req, ctx.res);
    const props = (await getServerSideProps?.(ctx)) || {};

    if (!session.userId) {
      return { props };
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
        role: true,
      },
    });

    return {
      props: {
        user,
        ...props,
      },
    };
  };
};
