import { ReactNode, createContext, useContext } from "react";
import { User } from "@maidanchyk/prisma";

export type AuthContext = {
  user: Pick<User, "id" | "email" | "name" | "photo" | "role"> | null;
};

const Context = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => {
  return useContext(Context);
};

type Props = {
  user: Pick<User, "id" | "email" | "name" | "photo" | "role"> | null;
  children: ReactNode;
};

export function AuthProvider({ user, children }: Props) {
  const value = {
    user,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
