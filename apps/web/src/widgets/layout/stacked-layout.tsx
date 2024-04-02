import { ReactNode } from "react";
import { Container, cn } from "@maidanchyk/ui";
import { Header } from "../header";
import { Footer } from "../footer";

type Props = {
  title?: string;
  badge?: ReactNode;
  spacing?: boolean;
  children: ReactNode;
};

export const StackedLayout = ({ title, badge, spacing = false, children }: Props) => {
  return (
    <div className="min-h-full">
      <Header />

      {title && (
        <Container className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 ">
            {title}
            {badge && <span className="ml-2 text-zinc-500 text-2xl">{badge}</span>}
          </h1>
        </Container>
      )}

      <main>
        <Container spacing={spacing}>{children}</Container>
      </main>

      <Footer />
    </div>
  );
};
