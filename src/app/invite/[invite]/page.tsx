"use client";

import { useParams } from "next/navigation";
import Confetti from "react-confetti";
import ErrorPanel from "~/app/_components/client/shared/error";
import Loading from "~/app/_components/client/shared/loading";
import UserAuthForm from "~/app/_components/user-auth-form";
import { api } from "~/trpc/react";

const Invite = () => {
  const { invite } = useParams<{ invite: string }>();

  const inviteValidation = api.store.validateInvite.useQuery(invite);

  if (inviteValidation.isError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <ErrorPanel
          message="Unknown invite"
          desc="This can happen if the invite has expired or if it was already used"
        />
      </div>
    );
  }

  if (inviteValidation.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading
          title="Validating invite"
          message="Please wait a few moments"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h1 className="text-6xl font-black tracking-tighter text-center">
        You've been invited to join "{inviteValidation.data?.store?.name}"
      </h1>
      <p className="text-center text-muted-foreground">
        By joining this store, you will be able to accept orders and manage
        mechanics.
      </p>

      <br />
      <UserAuthForm type="mechanic-join" inviteToken={invite} />
    </div>
  );
};

export default Invite;
