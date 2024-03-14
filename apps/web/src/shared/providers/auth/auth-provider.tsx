import { ReactNode, createContext, useContext } from "react";
import { User } from "@maidanchyk/prisma";
import { trpc } from "../../../server/trpc";

type UserProfile = Pick<User, "id" | "email" | "name" | "photo" | "telegram" | "phone" | "role">;

export type AuthContext = {
  user: UserProfile | null;
  refetch: () => Promise<any>;
};

const Context = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => {
  return useContext(Context);
};

type Props = {
  user: UserProfile | null;
  children: ReactNode;
};

export function AuthProvider(props: Props) {
  const { data: user, refetch } = trpc.auth.me.useQuery(undefined, { enabled: false });

  const value = {
    user: user ?? props.user,
    refetch,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
