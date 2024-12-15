"use client";

import { AvatarFallback } from "@radix-ui/react-avatar";
import Cookies from "js-cookie";
import Link from "next/link";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "~/components/ui/menubar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ContextMenu, ContextMenuTrigger } from "~/components/ui/context-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Checkbox } from "~/components/ui/checkbox";

interface MenuProps {
  avatar?: string;
}

const Menu = ({ avatar }: MenuProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [changeName, setChangeName] = useState<boolean>(false);
  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [img, setImg] = useState<string>("https://website.com/myavatar.png");

  const changeProfile = api.clients.changeProfile.useMutation({
    onSuccess: () => {
      setProfileModalOpen(false);
      window.location.reload();
    },
  });

  const saveProfile = () => {
    // This is probably such a poor way to handle this, TODO

    if (!changeName && !changeAvatar) {
      return;
    }

    if (!changeName && changeAvatar) {
      changeProfile.mutate({
        img,
      });
      return;
    }

    if (changeName && !changeAvatar) {
      changeProfile.mutate({
        name,
      });
      return;
    }

    changeProfile.mutate({
      name,
      img,
    });
  };

  return (
    <div className="w-full flex flex-row justify-between items-center">
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="flex flex-row gap-4 items-center col-span-3">
                <Checkbox
                  checked={changeName}
                  onClick={() => {
                    setChangeName(!changeName);
                  }}
                />
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>

                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  defaultValue="John Doe"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="flex flex-row gap-4 items-center col-span-3">
                <Checkbox
                  checked={changeAvatar}
                  onClick={() => {
                    setChangeAvatar(!changeAvatar);
                  }}
                />
                <Label htmlFor="avatar" className="text-right">
                  Avatar
                </Label>
                <Input
                  id="img"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  defaultValue="https://website.com/myavatar.png"
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                saveProfile();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger>
            <Link href={"/"}>Home</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Support</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Contact Us</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex p-4 items-center justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild></TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover>
          <PopoverTrigger>
            <ContextMenu>
              <ContextMenuTrigger
                onClick={() => {
                  setProfileModalOpen(true);
                }}
              >
                <Avatar className="h-10 w-10 flex items-center justify-center border-2">
                  <AvatarFallback>
                    <span className="tracking-tighter text-sm">US</span>
                  </AvatarFallback>
                  <AvatarImage src={avatar} className="object-cover" />
                </Avatar>
              </ContextMenuTrigger>
            </ContextMenu>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col p-4 space-y-2">
              <Button variant="outline">
                <Link href={"/profile"}>Profile</Link>
              </Button>
              <Button variant="outline">
                <Link href={"/settings"}>Settings</Link>
              </Button>

              <Button
                onClick={() => {
                  Cookies.remove("auth-token");
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Menu;
