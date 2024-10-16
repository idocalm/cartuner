"use client";
import { useRouter } from "next/navigation";
import UserAuthForm from "~/app/_components/user-auth-form";
import { Button } from "~/components/ui/button";

const SignInPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to your store
            </h1>
            <p className="text-sm text-muted-foreground">
              And start selling your products right now!
            </p>
          </div>
          <UserAuthForm type="mechanic-signin" />
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/")}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
