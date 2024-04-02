import { Fragment } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Button, Container, cn } from "@maidanchyk/ui";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/providers/auth";
import { UserRole } from "@maidanchyk/prisma";
import { UserMenu } from "../../features/user-menu";
import { Disclosure, Transition } from "@headlessui/react";
import { getInitials } from "../../shared/lib/strings";
import Image from "next/image";
import { NavLink } from "../../shared/ui";

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round">
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={cn("origin-center transition", open && "scale-90 opacity-0")}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={cn("origin-center transition", !open && "scale-90 opacity-0")}
      />
    </svg>
  );
}

export function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const navigation = () => {
    if (user?.role === UserRole.COURT_OWNER) {
      return [
        {
          name: "Майданчики",
          href: "/courts",
        },
        {
          name: "Мої Оголошення",
          href: "/courts/mine",
        },
      ];
    }

    return [
      {
        name: "Майданчики",
        href: "/courts",
      },
    ];
  };

  const userNavigation = () =>
    user
      ? [
          {
            name: "Налаштування",
            href: "/settings",
          },
          {
            name: "Вийти",
            href: "/api/auth/sign-out",
          },
        ]
      : [
          {
            name: "Увійти",
            href: "/auth/sign-in",
          },
          {
            name: "Зареєструватись",
            href: "/auth/sign-up",
          },
        ];

  return (
    <Disclosure as="header" className="py-10">
      <Container>
        <nav className=" z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link
              href="/"
              aria-label="Home"
              className="ring-offset-background focus-visible:ring-ring rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
              <Image src="/assets/logo-icon.png" alt="" height={40} width={32} />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {navigation().map((route) => (
                <NavLink
                  className={cn({
                    "bg-orange-50 text-orange-600": router.pathname === route.href,
                  })}
                  href={route.href}>
                  {route.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {!user && (
              <div className="hidden md:block">
                <NavLink className="mr-8" href="/auth/sign-in">
                  Увійти
                </NavLink>
                <Button color="blue" asChild>
                  <Link href="/auth/sign-up">Зареєструватись</Link>
                </Button>
              </div>
            )}

            <UserMenu className="hidden md:flex" />

            <div className="-mr-1 md:hidden">
              <Disclosure.Button
                className="ui-not-focus-visible:outline-none ring-offset-background focus-visible:ring-ring relative z-10 flex h-8 w-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Toggle Navigation">
                {({ open }) => <MobileNavIcon open={open} />}
              </Disclosure.Button>
            </div>
          </div>
        </nav>
      </Container>

      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <Disclosure.Panel className="md:hidden">
            <div className="mt-10 space-y-1 border-t border-gray-200 pb-3 pt-2">
              {navigation().map((route) => (
                <Disclosure.Button
                  key={route.name}
                  as={Link}
                  href={route.href}
                  className={cn(
                    route.href === router.pathname
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                  )}
                  aria-current={route.href === router.pathname ? "page" : undefined}>
                  {route.name}
                </Disclosure.Button>
              ))}
            </div>

            <div className="grid gap-y-3 border-t border-gray-200 pb-3 pt-4">
              {user && (
                <div className="flex items-center px-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photo || undefined} alt="" />
                    <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    {user.name && (
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                    )}
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {userNavigation().map((route) => (
                  <Disclosure.Button
                    key={route.name}
                    as={Link}
                    href={route.href}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    {route.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </Transition.Child>
      </Transition.Root>
    </Disclosure>
  );
}
