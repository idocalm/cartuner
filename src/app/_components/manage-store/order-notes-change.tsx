import { Notebook } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Textarea } from "~/components/ui/textarea";

interface OrderNotesChangeProps {
  currentNote: string;
  setNote: (notes: string) => void;
}

const OrderNotesChange: React.FC<OrderNotesChangeProps> = ({
  currentNote,
  setNote,
}) => {
  const [value, setValue] = useState<string>(currentNote);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Notebook size={24} className="cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Change order notes</DrawerTitle>
            <DrawerDescription>
              Enter any relevant notes for the order down.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Textarea
                placeholder="Enter new name"
                className="w-full"
                defaultValue="My Store"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  setNote(value);
                }}
              >
                Submit
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderNotesChange;
