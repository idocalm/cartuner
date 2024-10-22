import { Progress } from "~/components/ui/progress";
import { useEffect, useState } from "react";
import { Icons } from "~/components/ui/icons";

const Loading: React.FC<{ message: string; title: string }> = ({
  message,
  title,
}) => {
  /* animate and interpolate the progress bar */

  const [progress, setProgress] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 10) % 100);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <span className="text-muted-foreground">{message}</span>
      <Icons.spinner className="h-9 w-9 animate-spin" />
    </div>
  );
};

export default Loading;
