import { withUser } from "../shared/lib/ssr";
import { Header } from "../widgets/header";
import { Hero } from "../widgets/hero";
import { Newsletter } from "../widgets/newsletter";
import { Faqs } from "../widgets/faqs";
import { PrimaryFeatures } from "../widgets/primary-features";
import { Footer } from "../widgets/footer";
import { SecondaryFeatures } from "../widgets/secondary-features";

export default function Dashboard() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Newsletter />
        <Faqs />
      </main>

      <Footer className="bg-slate-50" />
    </>
  );
}

export const getServerSideProps = withUser();
