import Link from "next/link";
import LoginForm from "@/chunks/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-row">
      <section className="grid flex-1 place-items-center">
        <div className="flex flex-col gap-[22px] py-4 lg:min-w-[28rem]">
          <LoginForm />
          <section className="border-border rounded-xl p-4 text-center lg:border">
            <span>Don&#39;t have an account?</span>{" "}
            <Link
              href="/register"
              className="font-semibold text-primary underline hover:no-underline"
            >
              Sign up
            </Link>
          </section>
        </div>
      </section>
      <figure className="sticky top-0 hidden h-screen basis-1/2 bg-[url('/images/signin-banner.jpg')] bg-cover bg-center brightness-75 lg:block" />
    </main>
  );
}
