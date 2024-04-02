import { useEffect, useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Container, cn } from "@maidanchyk/ui";

const features = [
  {
    title: "Обирайте",
    description:
      "Мі зібрали усі доступні варіанти у вашому місті. Натискайте і заощаджуйте свій час",
    image: "/assets/feature-search.png",
  },
  {
    title: "Переглядайте",
    description: "Дізнавайтеся усю необхідну інформацію про майданчик разом із контактами власника",
    image: "/assets/feature-view.png",
  },
  {
    title: "Зберігайте",
    description: "Зберігайте вподобані майданчики, щоб швидко знайти їх у майбутньому",
    image: "/assets/feature-save.png",
  },
];

export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-gray-900 pb-28 pt-20 sm:py-32"
      id="features">
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Знайдіть <span className="text-orange-600">майданчик</span> для себе
          </h2>
          <p className="mt-6 text-lg tracking-tight text-zinc-300">
            Ми зібрали для наших користувачі повну базу спортивних залів. Ви можете вибрати місце з
            найзручнішим розташуванням поблизу
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}>
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      className={cn(
                        "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                          : "hover:bg-white/10 lg:hover:bg-white/5",
                      )}
                      key={feature.title}>
                      <h3>
                        <Tab
                          className={cn(
                            "font-display ui-not-focus-visible:outline-none text-lg",
                            selectedIndex === featureIndex
                              ? "text-orange-600 lg:text-white"
                              : "text-white hover:text-white lg:text-white",
                          )}>
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={cn(
                          "mt-2 hidden text-sm lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-zinc-300 group-hover:text-white",
                        )}>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <Image
                        alt=""
                        className="w-full"
                        height={1000}
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                        src={feature.image}
                        width={1000}
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}
