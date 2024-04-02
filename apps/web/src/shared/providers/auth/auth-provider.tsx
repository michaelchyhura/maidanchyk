import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { User } from "@maidanchyk/prisma";
import { trpc } from "../../../server/trpc";

type UserProfile = Pick<User, "id" | "email" | "name" | "photo" | "telegram" | "phone" | "role">;

export interface AuthContext {
  user: UserProfile | null;
  refetch: () => Promise<any>;
}

const Context = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => {
  return useContext(Context);
};

interface Props {
  user: UserProfile | null;
  children: ReactNode;
}

export function AuthProvider(props: Props) {
  const { data: user, refetch } = trpc.auth.me.useQuery(undefined, { enabled: false });

  const value = {
    user: user ?? props.user,
    refetch,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
