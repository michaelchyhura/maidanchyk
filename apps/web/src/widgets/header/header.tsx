import { Disclosure } from "@headlessui/react";
import { MenuIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, buttonVariants, cn } from "@maidanchyk/ui";
import { UserMenu } from "../../features/user-menu";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/providers/auth";
import { getInitials } from "../../shared/lib/strings";
import { UserRole } from "@maidanchyk/prisma";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const { user } = useAuth();

  const navigation = () => {
    if (user?.role === UserRole.COURT_OWNER) {
      return [
        {
          name: "Courts",
          href: "/courts",
        },
        {
          name: "My Courts",
          href: "/courts/mine",
        },
      ];
    }

    return [
      {
        name: "Courts",
        href: "/courts",
      },
    ];
  };

  const userNavigation = () =>
    user
      ? [
          {
            name: "Settings",
            href: "/settings",
          },
          {
            name: "Sign Out",
            href: "/api/auth/sign-out",
          },
        ]
      : [
          {
            name: "Sign In",
            href: "/auth/sign-in",
          },
          {
            name: "Sign Up",
            href: "/auth/sign-up",
          },
        ];

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link className="flex flex-shrink-0 items-center" href="/">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=orange&shade=500"
                    alt="Maidanchyk"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=orange&shade=500"
                    alt="Maidanchyk"
                  />
                </Link>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation().map((route) => (
                    <Link
                      key={route.name}
                      href={route.href}
                      className={cn(
                        route.href === router.pathname
                          ? "border-orange-500 text-orange-700"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                      )}
                      aria-current={route.href === router.pathname ? "page" : undefined}>
                      {route.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {!user && (
                  <>
                    <Button className="mr-4" variant="ghost" size="sm" asChild>
                      <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                  </>
                )}
                <UserMenu />
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button
                  className={buttonVariants({
                    size: "icon",
                    variant: "outline",
                    className: "relative",
                  })}>
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
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
        </>
      )}
    </Disclosure>
  );
};
