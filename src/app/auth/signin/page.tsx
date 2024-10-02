"use client";
import UserAuthForm from "~/app/_components/auth-form";

const SignInPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email & password below to get back into business!
            </p>
          </div>
          <UserAuthForm type="signin" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
