"use client";
import Link from "next/link";
import UserAuthForm from "~/app/_components/user-auth-form";

const SignUpPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email & password below to create your account
            </p>
          </div>
          <UserAuthForm type="signup" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/tos"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
