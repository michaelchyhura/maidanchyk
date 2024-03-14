import { ReactNode } from "react";
import { cn } from "@maidanchyk/ui";
import { Header } from "../header";

type Props = {
  title: string;
  spacing?: boolean;
  children: ReactNode;
};

export const StackedLayout = ({ title, spacing = false, children }: Props) => {
  return (
    <div className="min-h-full">
      <Header />

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {title}
            </h1>
          </div>
        </header>

        <main>
          <div className={cn("mx-auto max-w-7xl p-4 sm:p-6 lg:p-8", { "space-y-4": spacing })}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
