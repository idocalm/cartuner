"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "~/app/_components/auth-context";
import { useState } from "react";

const AdminPage = () => {
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const signin = api.admin.login.useMutation({
    onSuccess: ({ token, user }) => {
      toast({
        title: "Signed in successfully",
        duration: 1000,
      });

      Cookies.set("auth-token", token);
      setToken(token);

      setIsLoading(false);

      router.push("/screens/admin/dashboard");
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Sign in failed",
        description:
          "Something went wrong! Make sure you're using a valid email & password and try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-6xl font-black tracking-tighter text-center">
          <span className="text-greenish">cartuner</span> Admin Portal
        </h1>
        <p className="text-center text-muted-foreground">
          Enter your login details below.
        </p>

        <br />

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
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
              />
            </div>
          </div>
          <Button
            className="my-2"
            onClick={() => {
              setIsLoading(true);
              signin.mutate({ username, password });
            }}
          >
            Sign In
          </Button>
        </div>

        <br />
      </div>
    </div>
  );
};

export default AdminPage;
