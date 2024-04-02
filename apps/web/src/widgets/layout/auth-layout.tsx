import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-lg lg:w-[512px]">{children}</div>
      </div>
      <div className="relative hidden w-0 flex-1 bg-zinc-900 lg:block" />
    </div>
  );
}
