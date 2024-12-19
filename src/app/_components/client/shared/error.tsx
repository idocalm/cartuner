import { Card, CardContent } from "~/components/ui/card";
import { TriangleAlertIcon } from "lucide-react";

const ErrorPanel: React.FC<{ message: string; desc?: string }> = ({
  message,
  desc,
}) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex flex-col space-y-4 w-full items-center p-16">
            <TriangleAlertIcon size={80} className="text-red-500" />
            <p className="text-center text-lg font-semibold tracking-tighter">
              {message}
            </p>
            <div className="text-center text-sm font-semibold tracking-tighter flex-col items-center gap-4">
              {desc}

              <p>
                If this issue persists, please contact our support team at{" "}
                <a
                  href="mailto:support@caruner.com"
                  className="text-primary-500"
                >
                  support@cartuner.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPanel;
