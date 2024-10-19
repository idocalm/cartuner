import type { MechanicUser } from "@prisma/client";
import { Button } from "~/components/ui/button";

interface MechanicListProps {
  mechanics: MechanicUser[];
  store: string;
}

const MechanicList: React.FC<MechanicListProps> = ({ mechanics, store }) => {
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
        <div key={mechanic.id} className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-semibold">{mechanic.name}</p>
              <p className="text-sm text-gray-500">{mechanic.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MechanicList;
