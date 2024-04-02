import Image, { type ImageProps } from "next/image";
import { Tab } from "@headlessui/react";
import { Container, cn } from "@maidanchyk/ui";
import { PlusCircle, SquarePen, Users } from "lucide-react";

interface Feature {
  name: React.ReactNode;
  summary: string;
  description: string;
  image: ImageProps["src"];
  icon: React.ComponentType;
}

const features: Feature[] = [
  {
    name: "Лідогенерація",
    summary: "Збільшуйте поток клієнтів",
    description:
      "Ми беремо просування платформи і заохочення нових клієнтів на себе, даючи вам доступ до безкоштовної лідогенерації",
    image: "/assets/feature-leadgen.png",
    icon: Users,
  },
  {
    name: "Розміщення",
    summary: "Розміщуйте ваш зал та підвищуйте його рентабельність та популярність",
    description: "За потреби, наша команда допоможе вам з оформленням",
    image: "/assets/feature-create.png",
    icon: PlusCircle,
  },
  {
    name: "Управління",
    summary: "Переглядайте та управляйте вашими залами",
    description: "Управляйте вже опублікованими залами та редагуйте їх у будь-який час",
    image: "/assets/feature-manage.png",
    icon: SquarePen,
  },
];

function FeatureBlock({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  feature: Feature;
  isActive: boolean;
}) {
  return (
    <div className={cn(className, !isActive && "opacity-75 hover:opacity-100")} {...props}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-white",
          isActive ? "bg-orange-600" : "bg-slate-500",
        )}>
        <feature.icon />
      </div>
      <h3
        className={cn("mt-6 text-sm font-medium", isActive ? "text-orange-600" : "text-slate-600")}>
        {feature.name}
      </h3>
      <p className="font-display mt-2 text-xl text-slate-900">{feature.summary}</p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}

function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <FeatureBlock className="mx-auto max-w-2xl" feature={feature} isActive />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <Image
                alt=""
                className="w-full"
                height={1000}
                sizes="52.75rem"
                src={feature.image}
                width={1000}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <FeatureBlock
                className="relative"
                feature={{
                  ...feature,
                  name: (
                    <Tab className="ui-not-focus-visible:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                key={feature.summary}
              />
            ))}
          </Tab.List>
          <Tab.Panels className="rounded-4xl relative mt-20 overflow-hidden rounded-md bg-slate-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  aria-hidden={featureIndex !== selectedIndex}
                  className={cn(
                    "ui-not-focus-visible:outline-none px-5 transition duration-500 ease-in-out",
                    featureIndex !== selectedIndex && "opacity-60",
                  )}
                  key={feature.summary}
                  static
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}>
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <Image
                      alt=""
                      className="w-full"
                      height={1000}
                      sizes="52.75rem"
                      src={feature.image}
                      width={1000}
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="rounded-4xl pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
}

export function SecondaryFeatures() {
  return (
    <section
      aria-label="Features for simplifying everyday business tasks"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
      id="secondary-features">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            А що для власників бізнесу?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Використувуючи нашу платформу та інструменти, ви привернете увагу всіх користувачів до
            вашого бізнесу
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
