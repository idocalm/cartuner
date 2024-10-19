import { Card, CardContent } from "~/components/ui/card";
import { TriangleAlertIcon } from "lucide-react";

const ErorrPanel: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex flex-col space-y-4 w-full items-center p-16">
            <TriangleAlertIcon size={80} className="text-red-500" />
            <p className="text-center text-lg font-semibold tracking-tighter">
              {message}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErorrPanel;
