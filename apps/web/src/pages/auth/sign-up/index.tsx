import Link from "next/link";
import Image from "next/image";
import { AuthLayout } from "../../../widgets/layout";
import { SignUpForm } from "../../../features/sign-up-form";

export default function SignUp() {
  return (
    <AuthLayout>
      <div>
        <Link href="/">
          <Image alt="" height={40} src="/assets/logo-icon.png" width={32} />
        </Link>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Ласкаво просимо до Майданчика!
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Маєте обліковий запис?{" "}
          <Link
            className="font-semibold text-orange-600 hover:text-orange-500"
            href="/auth/sign-in">
            Увійти
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <SignUpForm />

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">Or Continue With</span>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full" variant="outline">
              <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </Button>
          </div>
        </div> */}
      </div>
    </AuthLayout>
  );
}
