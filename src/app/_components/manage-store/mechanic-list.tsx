import type { MechanicUser } from "@prisma/client";
import { Button } from "~/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";

interface MechanicListProps {
  mechanics: MechanicUser[];
  deleteMechanic: (id: string) => void;
}

const MechanicList: React.FC<MechanicListProps> = ({
  mechanics,
  deleteMechanic,
}) => {
  const [confirmationEmail, setConfirmationEmail] = useState<string>("");

  if (!mechanics || mechanics.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No mechanics are listed for this store.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {mechanics.map((mechanic) => (
        <div
          key={mechanic.id}
          className="flex items-center flex-row justify-between space-x-4"
        >
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-semibold text-white">{mechanic.name}</p>
              <p className="text-sm text-muted-foreground">{mechanic.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Edit</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="flex flex-col gap-4">
                      <div>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        <span className="font-semibold text-greenish tracking-tighter">
                          {mechanic.name}
                        </span>{" "}
                        from the store. To continue, enter:{" "}
                        <span className="font-semibold">{mechanic.email}</span>
                      </div>
                      <Label
                        htmlFor="confirm"
                        className="text-muted-foreground"
                      >
                        Confirm by typing the email address
                      </Label>
                      <Input
                        id="confirm"
                        value={confirmationEmail}
                        onChange={(e) => {
                          setConfirmationEmail(e.target.value);
                        }}
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={confirmationEmail !== mechanic.email}
                    onClick={() => {
                      setConfirmationEmail("");
                      deleteMechanic(mechanic.id);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MechanicList;
