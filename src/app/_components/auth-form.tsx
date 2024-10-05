"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Icons } from "~/components/ui/icons";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import { useAuth } from "./auth-context";
import Cookies from "js-cookie";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signup" | "signin";
}

const UserAuthForm = ({ className, type, ...props }: UserAuthFormProps) => {
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const signup = api.auth.register.useMutation({
    onSuccess: ({ token, user }) => {
      toast({
        title: "Account created successfully",
        description: "Welcome to cartuner! You're now signed in.",
        duration: 1000,
      });

      Cookies.set("auth-token", token);
      setToken(token);
      setName(user.name);
      setEmail(user.email);

      setIsLoading(false);

      router.push("/screens/client/dashboard");
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Account creation failed",
        description:
          "Something went wrong! Make sure you're using a valid email & password and try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const signin = api.auth.login.useMutation({
    onSuccess: ({ token, user }) => {
      toast({
        title: "Signed in successfully",
        description: "Welcome back to cartuner!",
      });

      Cookies.set("auth-token", token);
      setToken(token);
      setName(user.name);
      setEmail(user.email);
      setIsLoading(false);

      router.push("/screens/client/dashboard");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setIsLoading(false);
      setErrorMessage(error.message);
      toast({
        title: "Sign in failed",
        description:
          "Something went wrong! Make sure you're using a valid email & password and try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const onSubmit = () => {
    setIsLoading(true);

    if (type === "signup") {
      signup.mutate({
        email,
        password,
        name,
      });
    } else {
      signin.mutate({
        email,
        password,
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />
            {type === "signup" && (
              <Input
                id="name"
                placeholder="Name"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading}
              />
            )}
          </div>
          <p className="text-xs text-red-500 text-center">{errorMessage}</p>
        </div>
        <Button
          disabled={isLoading}
          className="my-2"
          onClick={() => {
            onSubmit();
          }}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In with Email
        </Button>
        {(type === "signup" && (
          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-primary">
              Sign in
            </a>
          </p>
        )) || (
          <p className="text-xs text-muted-foreground text-center">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-primary">
              Sign up
            </a>
          </p>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
