"use client";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CartItem } from "~/app/_components/store/cart";
import useCart from "~/hooks/use-cart";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Icons } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import { useAuth } from "~/app/_components/auth-context";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import { useRouter } from "next/navigation";

const CheckoutAuthForm: React.FC = () => {
  const [type, setType] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { setToken } = useAuth();
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

      location.reload();
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

      location.reload();
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

  const submit = () => {
    setIsLoading(true);
    if (type === "signin") {
      signin.mutate({
        email,
        password,
      });
    } else {
      signup.mutate({
        email,
        password,
        name,
      });
    }
  };

  return (
    <div className="grid gap-6">
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
            submit();
          }}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
        {(type === "signup" && (
          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <span
              className="text-primary hover:cursor-pointer"
              onClick={() => setType("signin")}
            >
              Sign in
            </span>
          </p>
        )) || <></>}
        {(type === "signin" && (
          <p className="text-xs text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <span
              className="text-primary hover:cursor-pointer"
              onClick={() => setType("signup")}
            >
              Sign up
            </span>
          </p>
        )) || <></>}
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
      <Button variant="outline" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
};

const CheckoutPage = () => {
  const cart = useCart();
  const [signedIn] = api.auth.isConnected.useSuspenseQuery();
  useEffect(() => {
    cart.load();
  }, []);

  if (!signedIn) {
    return (
      <div className="h-screen w-screen flex flex-col blur-sm">
        <Dialog open={true}>
          <DialogContent className="sm:max-w-[425px]" closable={false}>
            <DialogHeader>
              <DialogTitle>You're not signed in</DialogTitle>
              <DialogDescription>
                To complete your purchase, please sign in or create an account
                below.
                <br />
              </DialogDescription>
            </DialogHeader>
            <CheckoutAuthForm />
          </DialogContent>
        </Dialog>
        <div className="flex flex-col h-screen w-screen pb-16 pt-10 px-16 gap-4">
          <div className="flex flex-row justify-between w-full items-center z-10">
            <h1 className="text-4xl font-semibold tracking-tighter">
              Checkout
            </h1>
          </div>
          <Separator />
          <div className="border-t flex flex-row h-full relative">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="min-w-[250px]" defaultSize={40}>
                <div className="flex flex-col gap-4 py-4 pr-4">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <Separator />
                  {cart.content.map((item) => (
                    <CartItem
                      type="checkout"
                      key={item.product.id}
                      {...item}
                      remove={(productId: string) => {
                        cart.remove(productId);
                      }}
                    />
                  ))}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                className="min-w-[50%]"
                defaultSize={60}
              ></ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.content.reduce((acc, item) => {
    return acc + item.product.price * item.amount;
  }, 0);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-col h-screen w-screen pb-16 pt-10 px-16 gap-4">
        <div className="flex flex-row justify-between w-full items-center z-10">
          <h1 className="text-4xl font-semibold tracking-tighter">Checkout</h1>
          <Button
            variant="outline"
            onClick={() => {
              window.history.back();
            }}
          >
            Back
          </Button>
        </div>
        <Separator />
        <div className="border-t flex flex-row h-full relative">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="min-w-[250px]" defaultSize={40}>
              <div className="flex flex-col gap-4 py-4 pr-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <Separator />
                {cart.content.map((item) => (
                  <CartItem
                    type="checkout"
                    key={item.product.id}
                    {...item}
                    remove={(productId: string) => {
                      cart.remove(productId);
                    }}
                  />
                ))}
                <Separator />
                <div className="flex flex-row justify-between">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">${total}</p>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="min-w-[50%]" defaultSize={60}>
              <div className="flex flex-col gap-4 p-4">
                <h2 className="text-lg font-semibold">Payment</h2>
                <Separator />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
